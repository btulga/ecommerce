// src/controllers/coupon.controller.js
const CouponService = require('../services/coupon.service');

const CouponController = {
    // --- Admin CRUD ---
    async create(req, res) {
        try {
            const coupon = await CouponService.createCoupon(req.body);
            res.status(201).json(coupon);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const coupon = await CouponService.updateCoupon(id, req.body);
            res.json(coupon);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            await CouponService.deleteCoupon(id);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async getOneAdmin(req, res) {
        try {
            const { id } = req.params;
            const coupon = await CouponService.getCouponById(id);
            if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
            res.json(coupon);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async listAdmin(req, res) {
        try {
            const { q, limit, offset } = req.query;
            const data = await CouponService.listCoupons({ q, limit, offset });
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async setActive(req, res) {
        try {
            const { id } = req.params;
            const { is_active } = req.body;
            const coupon = await CouponService.setActive(id, is_active);
            res.json(coupon);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // --- Admin: Benefits ---
    async addBenefit(req, res) {
        try {
            const { id } = req.params;
            const row = await CouponService.addBenefit(id, req.body);
            res.status(201).json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async updateBenefit(req, res) {
        try {
            const { id, benefitId } = req.params;
            const row = await CouponService.updateBenefit(id, benefitId, req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async removeBenefit(req, res) {
        try {
            const { id, benefitId } = req.params;
            await CouponService.removeBenefit(id, benefitId);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // --- Admin: Conditions ---
    async addCondition(req, res) {
        try {
            const { id } = req.params;
            const row = await CouponService.addCondition(id, req.body);
            res.status(201).json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async updateCondition(req, res) {
        try {
            const { id, conditionId } = req.params;
            const row = await CouponService.updateCondition(id, conditionId, req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async removeCondition(req, res) {
        try {
            const { id, conditionId } = req.params;
            await CouponService.removeCondition(id, conditionId);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // --- Public ---
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const coupon = await CouponService.getCouponById(id);
            if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
            res.json(coupon);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async getByCode(req, res) {
        try {
            const { code } = req.params;
            const coupon = await CouponService.getCouponByCode(code);
            if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
            res.json(coupon);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async list(req, res) {
        try {
            const { q, limit, offset } = req.query;
            const data = await CouponService.listCoupons({ q, limit, offset });
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
};

module.exports = CouponController;
