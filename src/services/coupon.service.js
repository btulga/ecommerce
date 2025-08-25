// src/services/coupon.service.js
const db = require('../models');
const { sequelize, Sequelize, Coupon, CouponBenefit, CouponCondition } = db;
const { Op } = Sequelize;

const CouponService = {
    /**
     * Coupon-г benefits/conditions-тай нь хамт авах
     */
    async getCouponById(id) {
        return await Coupon.findByPk(id, {
            include: [
                { model: CouponBenefit, as: 'coupon_benefits' },
                { model: CouponCondition, as: 'coupon_conditions' },
            ],
        });
    },

    async getCouponByCode(code) {
        return await Coupon.findOne({
            where: { code },
            include: [
                { model: CouponBenefit, as: 'coupon_benefits' },
                { model: CouponCondition, as: 'coupon_conditions' },
            ],
        });
    },

    async listCoupons({ q, limit = 50, offset = 0 } = {}) {
        const where = {};
        if (q) {
            const like = { [Op.iLike]: `%${q}%` };
            where[Op.or] = [{ code: like }, { name: like }];
        }
        const { rows, count } = await Coupon.findAndCountAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            order: [['created_at', 'DESC']],
        });
        return { rows, count };
    },

    /**
     * Coupon үүсгэх (benefits, conditions массивтай хамт)
     * data: {
     *   code, name, ...,
     *   coupon_benefits: [{ type, value, ... }, ...],
     *   coupon_conditions: [{ field, operator, value, ... }, ...]
     * }
     */
    async createCoupon(data) {
        const { coupon_benefits, coupon_conditions, ...couponData } = data;

        return await sequelize.transaction(async (t) => {
            const coupon = await Coupon.create(couponData, { transaction: t });

            // benefits
            if (Array.isArray(coupon_benefits) && coupon_benefits.length > 0) {
                const rows = coupon_benefits.map((b) => ({ ...b, coupon_id: coupon.id }));
                await CouponBenefit.bulkCreate(rows, { transaction: t });
            }

            // conditions
            if (Array.isArray(coupon_conditions) && coupon_conditions.length > 0) {
                const rows = coupon_conditions.map((c) => ({ ...c, coupon_id: coupon.id }));
                await CouponCondition.bulkCreate(rows, { transaction: t });
            }

            return await this.getCouponById(coupon.id);
        });
    },

    /**
     * Coupon update + benefits/conditions sync
     * - Хэрэв benefit/condition item нь id-тэй ирвэл UPDATE
     * - id байхгүй бол CREATE
     * - Ирээгүй үлдсэн хуучин мөрүүдийг DELETE
     */
    async updateCoupon(id, updates) {
        const { coupon_benefits, coupon_conditions, ...couponData } = updates;

        return await sequelize.transaction(async (t) => {
            const coupon = await Coupon.findByPk(id, { transaction: t });
            if (!coupon) throw new Error('Coupon not found');

            await coupon.update(couponData, { transaction: t });

            // ---- Benefits sync ----
            if (Array.isArray(coupon_benefits)) {
                // одоогийн бүртгэлүүд
                const existingBenefits = await CouponBenefit.findAll({
                    where: { coupon_id: id },
                    transaction: t,
                });
                const existingIds = new Set(existingBenefits.map((b) => String(b.id)));

                const incomingIds = new Set(
                    coupon_benefits.filter((b) => b.id).map((b) => String(b.id))
                );

                // DELETE: ирээгүй үлдсэн id-ууд
                const toDelete = [...existingIds].filter((x) => !incomingIds.has(x));
                if (toDelete.length > 0) {
                    await CouponBenefit.destroy({
                        where: { id: { [Op.in]: toDelete }, coupon_id: id },
                        transaction: t,
                    });
                }

                // UPSERT (update эсвэл create)
                for (const item of coupon_benefits) {
                    if (item.id) {
                        // UPDATE
                        const row = await CouponBenefit.findOne({
                            where: { id: item.id, coupon_id: id },
                            transaction: t,
                        });
                        if (row) {
                            const { id: _omit, coupon_id: _omit2, ...payload } = item;
                            await row.update(payload, { transaction: t });
                        } else {
                            // id ирсэн ч өөр coupon-ы бол шинэчлэхгүй, шинээр үүсгэнэ
                            const { id: _omit, ...payload } = item;
                            await CouponBenefit.create({ ...payload, coupon_id: id }, { transaction: t });
                        }
                    } else {
                        // CREATE
                        await CouponBenefit.create({ ...item, coupon_id: id }, { transaction: t });
                    }
                }
            }

            // ---- Conditions sync ----
            if (Array.isArray(coupon_conditions)) {
                const existingConds = await CouponCondition.findAll({
                    where: { coupon_id: id },
                    transaction: t,
                });
                const existingIds = new Set(existingConds.map((c) => String(c.id)));
                const incomingIds = new Set(
                    coupon_conditions.filter((c) => c.id).map((c) => String(c.id))
                );

                const toDelete = [...existingIds].filter((x) => !incomingIds.has(x));
                if (toDelete.length > 0) {
                    await CouponCondition.destroy({
                        where: { id: { [Op.in]: toDelete }, coupon_id: id },
                        transaction: t,
                    });
                }

                for (const item of coupon_conditions) {
                    if (item.id) {
                        const row = await CouponCondition.findOne({
                            where: { id: item.id, coupon_id: id },
                            transaction: t,
                        });
                        if (row) {
                            const { id: _omit, coupon_id: _omit2, ...payload } = item;
                            await row.update(payload, { transaction: t });
                        } else {
                            const { id: _omit, ...payload } = item;
                            await CouponCondition.create({ ...payload, coupon_id: id }, { transaction: t });
                        }
                    } else {
                        await CouponCondition.create({ ...item, coupon_id: id }, { transaction: t });
                    }
                }
            }

            return await this.getCouponById(id);
        });
    },

    async deleteCoupon(id) {
        return await sequelize.transaction(async (t) => {
            // эхлээд child-уудыг устгах (FK CASCADE бол шаардахгүй)
            await CouponBenefit.destroy({ where: { coupon_id: id }, transaction: t });
            await CouponCondition.destroy({ where: { coupon_id: id }, transaction: t });
            const n = await Coupon.destroy({ where: { id }, transaction: t });
            if (n === 0) throw new Error('Coupon not found');
            return true;
        });
    },

    // ----------------- Child helper-ууд -----------------
    async addBenefit(couponId, payload) {
        const coupon = await Coupon.findByPk(couponId);
        if (!coupon) throw new Error('Coupon not found');
        const row = await CouponBenefit.create({ ...payload, coupon_id: couponId });
        return row;
    },

    async updateBenefit(couponId, benefitId, updates) {
        const row = await CouponBenefit.findOne({
            where: { id: benefitId, coupon_id: couponId },
        });
        if (!row) throw new Error('CouponBenefit not found');
        return await row.update(updates);
    },

    async removeBenefit(couponId, benefitId) {
        const n = await CouponBenefit.destroy({
            where: { id: benefitId, coupon_id: couponId },
        });
        if (n === 0) throw new Error('CouponBenefit not found');
        return true;
    },

    async addCondition(couponId, payload) {
        const coupon = await Coupon.findByPk(couponId);
        if (!coupon) throw new Error('Coupon not found');
        const row = await CouponCondition.create({ ...payload, coupon_id: couponId });
        return row;
    },

    async updateCondition(couponId, conditionId, updates) {
        const row = await CouponCondition.findOne({
            where: { id: conditionId, coupon_id: couponId },
        });
        if (!row) throw new Error('CouponCondition not found');
        return await row.update(updates);
    },

    async removeCondition(couponId, conditionId) {
        const n = await CouponCondition.destroy({
            where: { id: conditionId, coupon_id: couponId },
        });
        if (n === 0) throw new Error('CouponCondition not found');
        return true;
    },

    /**
     * Сул/идэвхгүй болгож асаах/унтраах (optional)
     */
    async setActive(id, is_active) {
        const coupon = await Coupon.findByPk(id);
        if (!coupon) throw new Error('Coupon not found');
        await coupon.update({ is_active: !!is_active });
        return coupon;
    },
};

module.exports = CouponService;
