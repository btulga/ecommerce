// src/controllers/promotion.controller.js
const PromotionService = require('../services/promotion.service');

const PromotionController = {
    // ------- Admin -------
    async create(req, res) {
        try {
            const promo = await PromotionService.create(req.body);
            res.status(201).json(promo);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const promo = await PromotionService.update(id, req.body);
            res.json(promo);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            await PromotionService.remove(id);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async getOneAdmin(req, res) {
        try {
            const { id } = req.params;
            const promo = await PromotionService.getById(id);
            if (!promo) return res.status(404).json({ error: 'Promotion not found' });
            res.json(promo);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async listAdmin(req, res) {
        try {
            const { q, status, campaign_id, starts_from, ends_to, limit, offset } = req.query;
            const data = await PromotionService.list({
                q, status, campaign_id, starts_from, ends_to, limit, offset,
            });
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // Conditions
    async addCondition(req, res) {
        try {
            const { id } = req.params;
            const row = await PromotionService.addCondition(id, req.body);
            res.status(201).json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async updateCondition(req, res) {
        try {
            const { id, conditionId } = req.params;
            const row = await PromotionService.updateCondition(id, conditionId, req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async removeCondition(req, res) {
        try {
            const { id, conditionId } = req.params;
            await PromotionService.removeCondition(id, conditionId);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // Benefits
    async addBenefit(req, res) {
        try {
            const { id } = req.params;
            const row = await PromotionService.addBenefit(id, req.body);
            res.status(201).json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async updateBenefit(req, res) {
        try {
            const { id, benefitId } = req.params;
            const row = await PromotionService.updateBenefit(id, benefitId, req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async removeBenefit(req, res) {
        try {
            const { id, benefitId } = req.params;
            await PromotionService.removeBenefit(id, benefitId);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // ------- Public (readonly) -------
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const promo = await PromotionService.getById(id);
            if (!promo) return res.status(404).json({ error: 'Promotion not found' });
            res.json(promo);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async list(req, res) {
        try {
            const { q, status, campaign_id, starts_from, ends_to, limit, offset } = req.query;
            const data = await PromotionService.list({
                q, status, campaign_id, starts_from, ends_to, limit, offset,
            });
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
};

module.exports = PromotionController;
