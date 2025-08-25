// src/services/promotion.service.js
const db = require('../models');
const { sequelize, Sequelize, Promotion, PromotionCondition, PromotionBenefit } = db;
const { Op } = Sequelize;

const PromotionService = {
    /**
     * Нэг promotion авах (conditions, benefits-тай)
     */
    async getById(id) {
        return await Promotion.findByPk(id, {
            include: [
                { model: PromotionCondition, as: 'conditions' },
                { model: PromotionBenefit, as: 'benefits' },
            ],
        });
    },

    /**
     * Жагсаалт + хайлт
     * filters: { q?, status?, campaign_id?, starts_from?, ends_to? }
     */
    async list({ q, status, campaign_id, starts_from, ends_to, limit = 50, offset = 0 } = {}) {
        const where = {};
        if (q) {
            const like = { [Op.iLike]: `%${q}%` };
            where[Op.or] = [{ name: like }, { description: like }, { code: like }];
        }
        if (status) where.status = status;
        if (campaign_id) where.campaign_id = campaign_id;

        if (starts_from) where.starts_at = { [Op.gte]: new Date(starts_from) };
        if (ends_to) {
            where.ends_at = where.ends_at || {};
            where.ends_at[Op.lte] = new Date(ends_to);
        }

        const { rows, count } = await Promotion.findAndCountAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            order: [['created_at', 'DESC']],
        });

        return { rows, count };
    },

    /**
     * Promotion үүсгэх
     * data = {
     *   name, code?, description?, status?, starts_at?, ends_at?, campaign_id?, metadata?,
     *   conditions: [{ field, operator, value, ... }],
     *   benefits:   [{ type, value, currency?, ... }]
     * }
     */
    async create(data) {
        const { conditions, benefits, ...payload } = data;
        validateSchedule(payload.starts_at, payload.ends_at);

        return await sequelize.transaction(async (t) => {
            const promo = await Promotion.create(payload, { transaction: t });

            if (Array.isArray(conditions) && conditions.length > 0) {
                const rows = conditions.map((c) => ({ ...c, promotion_id: promo.id }));
                await PromotionCondition.bulkCreate(rows, { transaction: t });
            }

            if (Array.isArray(benefits) && benefits.length > 0) {
                const rows = benefits.map((b) => ({ ...b, promotion_id: promo.id }));
                await PromotionBenefit.bulkCreate(rows, { transaction: t });
            }

            return await this.getById(promo.id);
        });
    },

    /**
     * Promotion шинэчлэх + conditions/benefits sync
     */
    async update(id, updates) {
        const { conditions, benefits, ...payload } = updates;
        validateSchedule(payload.starts_at, payload.ends_at);

        return await sequelize.transaction(async (t) => {
            const promo = await Promotion.findByPk(id, { transaction: t });
            if (!promo) throw new Error('Promotion not found');

            await promo.update(payload, { transaction: t });

            // ---- Conditions sync ----
            if (Array.isArray(conditions)) {
                const existing = await PromotionCondition.findAll({
                    where: { promotion_id: id },
                    transaction: t,
                });
                const existingIds = new Set(existing.map((r) => String(r.id)));
                const incomingIds = new Set(conditions.filter((c) => c.id).map((c) => String(c.id)));

                // delete missing
                const toDelete = [...existingIds].filter((x) => !incomingIds.has(x));
                if (toDelete.length) {
                    await PromotionCondition.destroy({
                        where: { id: { [Op.in]: toDelete }, promotion_id: id },
                        transaction: t,
                    });
                }

                // upsert
                for (const item of conditions) {
                    if (item.id) {
                        const row = await PromotionCondition.findOne({
                            where: { id: item.id, promotion_id: id },
                            transaction: t,
                        });
                        const { id: _omit, promotion_id: _omit2, ...dataOnly } = item;
                        if (row) await row.update(dataOnly, { transaction: t });
                        else
                            await PromotionCondition.create(
                                { ...dataOnly, promotion_id: id },
                                { transaction: t }
                            );
                    } else {
                        await PromotionCondition.create(
                            { ...item, promotion_id: id },
                            { transaction: t }
                        );
                    }
                }
            }

            // ---- Benefits sync ----
            if (Array.isArray(benefits)) {
                const existing = await PromotionBenefit.findAll({
                    where: { promotion_id: id },
                    transaction: t,
                });
                const existingIds = new Set(existing.map((r) => String(r.id)));
                const incomingIds = new Set(benefits.filter((b) => b.id).map((b) => String(b.id)));

                const toDelete = [...existingIds].filter((x) => !incomingIds.has(x));
                if (toDelete.length) {
                    await PromotionBenefit.destroy({
                        where: { id: { [Op.in]: toDelete }, promotion_id: id },
                        transaction: t,
                    });
                }

                for (const item of benefits) {
                    if (item.id) {
                        const row = await PromotionBenefit.findOne({
                            where: { id: item.id, promotion_id: id },
                            transaction: t,
                        });
                        const { id: _omit, promotion_id: _omit2, ...dataOnly } = item;
                        if (row) await row.update(dataOnly, { transaction: t });
                        else
                            await PromotionBenefit.create(
                                { ...dataOnly, promotion_id: id },
                                { transaction: t }
                            );
                    } else {
                        await PromotionBenefit.create({ ...item, promotion_id: id }, { transaction: t });
                    }
                }
            }

            return await this.getById(id);
        });
    },

    /**
     * Устгах (FK CASCADE байвал children автоматаар устна,
     * RESTRICT байвал доорх destroy-ууд хэрэгтэй)
     */
    async remove(id) {
        return await sequelize.transaction(async (t) => {
            await PromotionCondition.destroy({ where: { promotion_id: id }, transaction: t });
            await PromotionBenefit.destroy({ where: { promotion_id: id }, transaction: t });
            const n = await Promotion.destroy({ where: { id }, transaction: t });
            if (n === 0) throw new Error('Promotion not found');
            return true;
        });
    },

    // ---------- Child helpers ----------
    async addCondition(promotionId, payload) {
        await ensurePromotion(promotionId);
        return await PromotionCondition.create({ ...payload, promotion_id: promotionId });
    },

    async updateCondition(promotionId, conditionId, updates) {
        const row = await PromotionCondition.findOne({
            where: { id: conditionId, promotion_id: promotionId },
        });
        if (!row) throw new Error('PromotionCondition not found');
        return await row.update(updates);
    },

    async removeCondition(promotionId, conditionId) {
        const n = await PromotionCondition.destroy({
            where: { id: conditionId, promotion_id: promotionId },
        });
        if (n === 0) throw new Error('PromotionCondition not found');
        return true;
    },

    async addBenefit(promotionId, payload) {
        await ensurePromotion(promotionId);
        return await PromotionBenefit.create({ ...payload, promotion_id: promotionId });
    },

    async updateBenefit(promotionId, benefitId, updates) {
        const row = await PromotionBenefit.findOne({
            where: { id: benefitId, promotion_id: promotionId },
        });
        if (!row) throw new Error('PromotionBenefit not found');
        return await row.update(updates);
    },

    async removeBenefit(promotionId, benefitId) {
        const n = await PromotionBenefit.destroy({
            where: { id: benefitId, promotion_id: promotionId },
        });
        if (n === 0) throw new Error('PromotionBenefit not found');
        return true;
    },

    // ---------- Энгийн бизнес логик ----------
    isActiveNow(promo, at = new Date()) {
        if (!promo) return false;
        if (promo.status && promo.status !== 'active') return false;
        if (promo.starts_at && new Date(promo.starts_at) > at) return false;
        if (promo.ends_at && new Date(promo.ends_at) < at) return false;
        return true;
    },
};

// ---- Helpers ----
function validateSchedule(starts_at, ends_at) {
    if (!starts_at && !ends_at) return;
    const s = starts_at ? new Date(starts_at) : null;
    const e = ends_at ? new Date(ends_at) : null;
    if (s && e && s > e) throw new Error('starts_at must be earlier than ends_at');
}

async function ensurePromotion(id) {
    const p = await Promotion.findByPk(id);
    if (!p) throw new Error('Promotion not found');
    return p;
}

module.exports = PromotionService;
