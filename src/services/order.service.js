// src/services/order.service.js
const db = require('../models');
const { sequelize, Sequelize } = db;
const { Op } = Sequelize;

const {
    Order,
    OrderItem,
    Cart,
    CartItem,
    Customer,
    Address,
    ProductVariant,
    Payment,
} = db;

// Захиалгын статусууд (fulfillment-гүй)
const ORDER_STATUSES = new Set([
    'pending',          // үүссэн, төлбөр хүлээж буй
    'requires_action',  // 3DS/OTP гэх мэт
    'paid',             // төлбөр баталгаажсан
    'completed',        // post-processing дууссан (гардуулсан/хаасан)
    'canceled',         // цуцлагдсан
]);

const OrderService = {
    // ----------------- Reads -----------------
    async getById(id) {
        return await Order.findByPk(id, {
            include: [
                { model: Customer, as: 'customer' },
                { model: OrderItem, as: 'items', include: [{ model: ProductVariant, as: 'variant' }] },
                { model: Payment, as: 'payments' },
            ],
        });
    },

    async list({ q, status, customer_id, date_from, date_to, limit = 50, offset = 0 } = {}) {
        const where = {};
        if (q) {
            const like = { [Op.iLike]: `%${q}%` };
            where[Op.or] = [{ id: like }, { currency_code: like }];
        }
        if (status) where.status = status;
        if (customer_id) where.customer_id = customer_id;
        if (date_from) where.created_at = { ...(where.created_at || {}), [Op.gte]: new Date(date_from) };
        if (date_to)   where.created_at = { ...(where.created_at || {}), [Op.lte]: new Date(date_to) };

        const { rows, count } = await Order.findAndCountAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            order: [['created_at', 'DESC']],
            include: [
                { model: Customer, as: 'customer' },
                { model: OrderItem, as: 'items' },
            ],
        });

        return { rows, count };
    },

    // ----------------- Create -----------------
    /**
     * Сагсаас захиалга үүсгэх
     */
    async createFromCart(cart_id, { metadata } = {}) {
        return await sequelize.transaction(async (t) => {
            const cart = await Cart.findByPk(cart_id, {
                include: [{ model: CartItem, as: 'items', include: [{ model: ProductVariant, as: 'variant' }] }],
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (!cart) throw new Error('Cart not found');
            if (!['draft', 'active'].includes(cart.status)) throw new Error('Cart is not eligible for order');

            // (санал) Inventory резерв/commit энд
            // await InventoryService.commitOnOrder(cart.items, { transaction: t });

            const order = await Order.create(
                {
                    customer_id: cart.customer_id || null,
                    currency_code: cart.currency_code,
                    status: 'pending',
                    subtotal: Number(cart.subtotal || 0),
                    discount_total: Number(cart.discount_total || 0),
                    shipping_total: Number(cart.shipping_total || 0),
                    tax_total: Number(cart.tax_total || 0),
                    total: Number(cart.total || 0),
                    shipping_address: cart.shipping_address || null,
                    billing_address: cart.billing_address || null,
                    metadata: { ...(cart.metadata || {}), ...(metadata || {}) },
                },
                { transaction: t }
            );

            for (const it of cart.items) {
                await OrderItem.create(
                    {
                        order_id: order.id,
                        variant_id: it.variant_id,
                        title: it.variant?.title || it.title || null,
                        quantity: it.quantity,
                        unit_price: it.unit_price,
                        subtotal: Number(it.unit_price) * Number(it.quantity),
                        total: Number(it.total || Number(it.unit_price) * Number(it.quantity)),
                        metadata: it.metadata || {},
                    },
                    { transaction: t }
                );
            }

            await cart.update({ status: 'completed' }, { transaction: t });
            await recalcTotals(order.id, { transaction: t });
            return await this.getById(order.id);
        });
    },

    /**
     * Шууд захиалга үүсгэх (админ/API)
     */
    async create(data) {
        const {
            customer_id = null,
            currency_code = 'MNT',
            items = [],
            shipping_address_id,
            billing_address_id,
            shipping_address,
            billing_address,
            discount_total = 0,
            tax_total = 0,
            shipping_total = 0,
            metadata,
        } = data;

        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('items is required');
        }

        return await sequelize.transaction(async (t) => {
            const shipSnap = shipping_address_id
                ? snapshotAddress(await Address.findByPk(shipping_address_id, { transaction: t }))
                : (shipping_address || null);
            const billSnap = billing_address_id
                ? snapshotAddress(await Address.findByPk(billing_address_id, { transaction: t }))
                : (billing_address || null);

            const order = await Order.create(
                {
                    customer_id,
                    currency_code,
                    status: 'pending',
                    discount_total: Number(discount_total || 0),
                    shipping_total: Number(shipping_total || 0),
                    tax_total: Number(tax_total || 0),
                    shipping_address: shipSnap,
                    billing_address: billSnap,
                    metadata,
                },
                { transaction: t }
            );

            for (const it of items) {
                const variant = it.variant_id
                    ? await ProductVariant.findByPk(it.variant_id, { transaction: t })
                    : null;
                const unit = it.unit_price != null ? Number(it.unit_price) : Number(variant?.price || 0);
                const qty = Number(it.quantity || 1);

                await OrderItem.create(
                    {
                        order_id: order.id,
                        variant_id: it.variant_id || null,
                        title: it.title || variant?.title || null,
                        quantity: qty,
                        unit_price: unit,
                        subtotal: unit * qty,
                        total: unit * qty,
                        metadata: it.metadata || {},
                    },
                    { transaction: t }
                );
            }

            await recalcTotals(order.id, { transaction: t });
            return await this.getById(order.id);
        });
    },

    // ----------------- Payments -----------------
    /**
     * Төлбөрийн мөр нэмэх
     * payload: { provider, amount, currency_code, status('pending'|'succeeded'|'failed'), transaction_id?, data? }
     */
    async addPayment(order_id, payload) {
        return await sequelize.transaction(async (t) => {
            const order = await Order.findByPk(order_id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!order) throw new Error('Order not found');
            if (order.status === 'canceled') throw new Error('Order is canceled');

            const p = await Payment.create({ ...payload, order_id }, { transaction: t });

            if (p.status === 'succeeded') {
                await order.update({ status: 'paid', paid_at: new Date() }, { transaction: t });
            } else if (p.status === 'pending') {
                await order.update({ status: 'requires_action' }, { transaction: t });
            }

            return await this.getById(order_id);
        });
    },

    async markPaid(order_id) {
        const order = await Order.findByPk(order_id);
        if (!order) throw new Error('Order not found');
        await order.update({ status: 'paid', paid_at: new Date() });
        return await this.getById(order_id);
    },

    // ----------------- Update / Status -----------------
    async setStatus(order_id, status) {
        if (!ORDER_STATUSES.has(status)) throw new Error('Invalid status');
        const order = await Order.findByPk(order_id);
        if (!order) throw new Error('Order not found');
        await order.update({ status });
        return await this.getById(order_id);
    },

    async setAddresses(order_id, { shipping_address_id, billing_address_id, shipping_address, billing_address }) {
        const order = await Order.findByPk(order_id);
        if (!order) throw new Error('Order not found');

        const shipSnap = shipping_address_id
            ? snapshotAddress(await Address.findByPk(shipping_address_id))
            : (shipping_address || order.shipping_address);
        const billSnap = billing_address_id
            ? snapshotAddress(await Address.findByPk(billing_address_id))
            : (billing_address || order.billing_address);

        await order.update({ shipping_address: shipSnap, billing_address: billSnap });
        return await this.getById(order_id);
    },

    async setMetadata(order_id, metadata = {}) {
        const order = await Order.findByPk(order_id);
        if (!order) throw new Error('Order not found');
        await order.update({ metadata });
        return await this.getById(order_id);
    },

    // ----------------- Cancel -----------------
    async cancel(order_id, { reason, restock = true } = {}) {
        return await sequelize.transaction(async (t) => {
            const order = await Order.findByPk(order_id, {
                include: [{ model: OrderItem, as: 'items' }],
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (!order) throw new Error('Order not found');
            if (order.status === 'canceled') return order;

            // (санал) Inventory-г буцааж нэмэх
            // if (restock) await InventoryService.restockOnCancel(order.items, { transaction: t });

            await order.update({ status: 'canceled', canceled_at: new Date(), cancel_reason: reason || null }, { transaction: t });
            return await this.getById(order_id);
        });
    },
};

/** ---------- Helpers ---------- */

async function recalcTotals(order_id, { transaction } = {}) {
    const items = await OrderItem.findAll({ where: { order_id }, transaction });
    const subtotal = items.reduce((s, it) => s + Number(it.total || 0), 0);

    const order = await Order.findByPk(order_id, { transaction });
    const shipping = Number(order.shipping_total || 0);
    const discount = Number(order.discount_total || 0);
    const tax = Number(order.tax_total || 0);

    const total = Math.max(0, subtotal + shipping + tax - discount);
    await order.update({ subtotal, total }, { transaction });
    return { subtotal, total };
}

function snapshotAddress(a) {
    if (!a) return null;
    const j = a.toJSON ? a.toJSON() : a;
    const { id, customer_id, created_at, updated_at, ...rest } = j;
    return rest;
}

module.exports = OrderService;
