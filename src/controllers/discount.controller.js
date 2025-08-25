// src/controllers/discount.controller.js
const DiscountService = require('../services/discount.service');

const DiscountController = {
    // --- Admin ---
    async create(req, res) {
        try {
            const discount = await DiscountService.createDiscount(req.body);
            res.status(201).json(discount);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const discount = await DiscountService.updateDiscount(id, req.body);
            res.json(discount);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            await DiscountService.deleteDiscount(id);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async getOneAdmin(req, res) {
        try {
            const { id } = req.params;
            const discount = await DiscountService.getDiscountById(id);
            if (!discount) return res.status(404).json({ error: 'Discount not found' });
            res.json(discount);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async getAllAdmin(req, res) {
        try {
            // Хялбар pagination & хайлт (optional)
            const { q, limit = 50, offset = 0 } = req.query;
            let list = await DiscountService.getAllDiscounts();

            if (q) {
                const qLower = q.toLowerCase();
                list = list.filter(
                    (d) =>
                        (d.name && d.name.toLowerCase().includes(qLower)) ||
                        (d.discount_type && d.discount_type.toLowerCase().includes(qLower))
                );
            }

            res.json(list.slice(Number(offset), Number(offset) + Number(limit)));
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // --- Public ---
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const discount = await DiscountService.getDiscountById(id);
            if (!discount) return res.status(404).json({ error: 'Discount not found' });
            res.json(discount);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async getAll(req, res) {
        try {
            const list = await DiscountService.getAllDiscounts();
            res.json(list);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
};

module.exports = DiscountController;
