// src/services/payment.service.js
const db = require('../models');
const { sequelize, Sequelize, Payment, Order } = db;
const { Op } = Sequelize;

const PAYMENT_STATUSES = new Set(['pending', 'succeeded', 'failed', 'void', 'refunded']);

/**
 * Тэмдэглэл:
 * - Бодит capture/void/refund нь гадаад төлбөрийн провайдер дээр явагдана.
 * - Энэ service нь provider-оос ирсэн үр дүнг DB-д тусгаж, Order-ийн төлөв/нийт төлөлтийг уялдуулна.
 */

const PaymentService = {
    // ---------- Reads ----------
    async getById(id) {
        return await Payment.findByPk(id, {
            include: [{ model: Order, as: 'order' }],
        });
    },

    async list({ order_id, status, provider, date_from, date_to, limit = 50, offset = 0 } = {}) {
        const where = {};
        if (order_id) where.order_id = order_id;
        if (status) where.status = status;
        if (provider) where.provider = provider;
        if (date_from) where.created_at = { ...(where.created_at || {}), [Op.gte]: new Date(date_from) };
        if (date_to)   where.created_at = { ...(where.created_at || {}), [Op.lte]: new Date(date_to) };

        const { rows, count } = await Payment.findAndCountAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            order: [['created_at', 'DESC']],
        });
        return { rows, count };
    },

    // ---------- Create ----------
    /**
     * payload: { provider, amount, currency_code, status?='pending', transaction_id?, data?, metadata? }
     * Санал: provider талд төлбөр эхлүүлэх үед pending бичлэг үүсгээд, callback/webhook дээр markSucceeded/markFailed дуудах
     */
    async create(order_id, payload) {
        return await sequelize.transaction(async (t) => {
            const order = await Order.findByPk(order_id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!order) throw new Error('Order not found');
            if (order.status === 'canceled') throw new Error('Order is canceled');

            const status = payload.status || 'pending';
            if (!PAYMENT_STATUSES.has(status)) throw new Error('Invalid payment status');

            const p = await Payment.create(
                {
                    order_id,
                    provider: payload.provider,
                    amount: Number(payload.amount || 0),
                    currency_code: payload.currency_code || order.currency_code,
                    status,
                    transaction_id: payload.transaction_id || null,
                    data: payload.data || null,
                    metadata: payload.metadata || null,
                    captured_at: status === 'succeeded' ? new Date() : null,
                    refunded_amount: 0,
                },
                { transaction: t }
            );

            // Order статус уялдуулах
            await reconcileOrderPaymentState(order, { transaction: t });

            return await this.getById(p.id);
        });
    },

    // ---------- Status changes ----------
    async markSucceeded(payment_id, { transaction_id, data } = {}) {
        return await sequelize.transaction(async (t) => {
            const p = await Payment.findByPk(payment_id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!p) throw new Error('Payment not found');
            if (['succeeded', 'void', 'refunded'].includes(p.status)) return p; // идempotent-ish

            await p.update(
                {
                    status: 'succeeded',
                    transaction_id: transaction_id ?? p.transaction_id,
                    data: data ?? p.data,
                    captured_at: new Date(),
                },
                { transaction: t }
            );

            const order = await Order.findByPk(p.order_id, { transaction: t, lock: t.LOCK.UPDATE });
            await reconcileOrderPaymentState(order, { transaction: t });

            return await this.getById(payment_id);
        });
    },

    async markFailed(payment_id, { data } = {}) {
        return await sequelize.transaction(async (t) => {
            const p = await Payment.findByPk(payment_id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!p) throw new Error('Payment not found');
            if (p.status !== 'pending') return p; // зөвхөн pending-ийг failed болгоно (журмаасаа хамаарна)

            await p.update({ status: 'failed', data: data ?? p.data }, { transaction: t });

            const order = await Order.findByPk(p.order_id, { transaction: t, lock: t.LOCK.UPDATE });
            await reconcileOrderPaymentState(order, { transaction: t });

            return await this.getById(payment_id);
        });
    },

    async void(payment_id, { reason, data } = {}) {
        return await sequelize.transaction(async (t) => {
            const p = await Payment.findByPk(payment_id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!p) throw new Error('Payment not found');
            if (!['pending', 'succeeded'].includes(p.status)) throw new Error('Payment cannot be voided');

            await p.update({ status: 'void', data: { ...(p.data || {}), reason, ...(data || {}) } }, { transaction: t });

            const order = await Order.findByPk(p.order_id, { transaction: t, lock: t.LOCK.UPDATE });
            await reconcileOrderPaymentState(order, { transaction: t });

            return await this.getById(payment_id);
        });
    },

    // ---------- Refunds ----------
    /**
     * Хэсэгчилсэн/бүтэн буцаалт.
     * amount: буцаах хэмжээ (валют – payment.currency_code)
     */
    async refund(payment_id, { amount, reason, data } = {}) {
        return await sequelize.transaction(async (t) => {
            const p = await Payment.findByPk(payment_id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!p) throw new Error('Payment not found');
            if (p.status !== 'succeeded') throw new Error('Only succeeded payments can be refunded');

            const amt = Number(amount || 0);
            if (amt <= 0) throw new Error('Refund amount must be > 0');

            const already = Number(p.refunded_amount || 0);
            if (already + amt > Number(p.amount)) {
                throw new Error('Refund amount exceeds captured amount');
            }

            const newRefunded = already + amt;
            const newStatus = newRefunded === Number(p.amount) ? 'refunded' : 'succeeded';

            await p.update(
                {
                    refunded_amount: newRefunded,
                    status: newStatus,
                    data: { ...(p.data || {}), refund: { amount: amt, reason, at: new Date(), ...(data || {}) } },
                },
                { transaction: t }
            );

            const order = await Order.findByPk(p.order_id, { transaction: t, lock: t.LOCK.UPDATE });
            await reconcileOrderPaymentState(order, { transaction: t });

            return await this.getById(payment_id);
        });
    },

    // ---------- Metadata ----------
    async setMetadata(payment_id, metadata = {}) {
        const p = await Payment.findByPk(payment_id);
        if (!p) throw new Error('Payment not found');
        await p.update({ metadata });
        return await this.getById(payment_id);
    },
};

/* ---------------- Helpers ---------------- */

async function reconcileOrderPaymentState(order, { transaction } = {}) {
    if (!order) return;

    // Тухайн захиалгын бүх төлбөрийг уншина
    const payments = await Payment.findAll({
        where: { order_id: order.id },
        transaction,
    });

    const paid = sum(payments.filter((p) => p.status === 'succeeded').map((p) => Number(p.amount || 0)));
    const refunded = sum(payments.map((p) => Number(p.refunded_amount || 0)));
    const netPaid = Math.max(0, paid - refunded);

    const total = Number(order.total || 0);

    // Хэрвээ Order дээр paid_total багана байгаа бол шинэчлээд явж болно
    const patch = {};
    if ('paid_total' in order) patch.paid_total = netPaid;

    // Статус уялдуулах:
    // - цаанаас “succeeded” орж ирвэл → paid (эсвэл бүрэн төлөгдвөл completed)
    // - pending/failed/void → requires_action эсвэл pending хэвээр
    if (netPaid >= total && total > 0) {
        patch.status = 'completed'; // эсвэл 'paid' → дараа completed болгох урсгалтай байж болно
        patch.paid_at = order.paid_at || new Date();
    } else if (netPaid > 0) {
        patch.status = 'paid';
        patch.paid_at = order.paid_at || new Date();
    } else {
        // төлбөр байхгүй – pending эсвэл requires_action
        // pending төлбөр байвал requires_action болгож болно
        const hasPending = payments.some((p) => p.status === 'pending');
        patch.status = hasPending ? 'requires_action' : 'pending';
    }

    await order.update(patch, { transaction });
}

function sum(arr) {
    return arr.reduce((s, v) => s + Number(v || 0), 0);
}

module.exports = PaymentService;
