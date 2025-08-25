// src/controllers/campaign.controller.js
const CampaignService = require('../services/campaign.service');

const parseBool = (v) => {
    if (v === undefined) return false;
    const s = String(v).toLowerCase();
    return s === '1' || s === 'true' || s === 'yes';
};

const CampaignController = {
    // --- Admin ---
    async create(req, res) {
        try {
            const campaign = await CampaignService.create(req.body);
            res.status(201).json(campaign);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const campaign = await CampaignService.update(id, req.body);
            res.json(campaign);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            await CampaignService.remove(id);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async setStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body; // draft | active | inactive | expired
            const campaign = await CampaignService.setStatus(id, status);
            res.json(campaign);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async activate(req, res) {
        try {
            const { id } = req.params;
            const campaign = await CampaignService.activate(id);
            res.json(campaign);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async deactivate(req, res) {
        try {
            const { id } = req.params;
            const campaign = await CampaignService.deactivate(id);
            res.json(campaign);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    /**
     * Дууссан кампайнуудыг expire болгох (cron/админ action)
     * GET /admin/campaigns/expire-ended?now=2025-08-25T00:00:00Z
     */
    async expireEnded(req, res) {
        try {
            const now = req.query.now ? new Date(req.query.now) : new Date();
            const result = await CampaignService.expireEndedCampaigns(now);
            res.json(result);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async getOneAdmin(req, res) {
        try {
            const { id } = req.params;
            const withPromotions = parseBool(req.query.withPromotions);
            const campaign = await CampaignService.getById(id, { withPromotions });
            if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
            res.json(campaign);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async listAdmin(req, res) {
        try {
            const { q, status, starts_from, ends_to, limit, offset } = req.query;
            const withPromotions = parseBool(req.query.withPromotions);
            const data = await CampaignService.list(
                { q, status, starts_from, ends_to, limit, offset },
                { withPromotions }
            );
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // --- Public (унших) ---
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const withPromotions = parseBool(req.query.withPromotions);
            const campaign = await CampaignService.getById(id, { withPromotions });
            if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
            res.json(campaign);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async list(req, res) {
        try {
            const { q, status, starts_from, ends_to, limit, offset } = req.query;
            const withPromotions = parseBool(req.query.withPromotions);
            const data = await CampaignService.list(
                { q, status, starts_from, ends_to, limit, offset },
                { withPromotions }
            );
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
};

module.exports = CampaignController;
