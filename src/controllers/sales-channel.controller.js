// src/controllers/sales-channel.controller.js
const SalesChannelService = require('../services/sales-channel.service');

const SalesChannelController = {
    // --- Admin ---
    async create(req, res) {
        try {
            const sc = await SalesChannelService.createSalesChannel(req.body);
            res.status(201).json(sc);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const sc = await SalesChannelService.updateSalesChannel(id, req.body);
            res.json(sc);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            await SalesChannelService.deleteSalesChannel(id);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async addProduct(req, res) {
        try {
            const { id, productId } = req.params;
            const r = await SalesChannelService.addProduct(id, productId);
            res.json(r);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async removeProduct(req, res) {
        try {
            const { id, productId } = req.params;
            const r = await SalesChannelService.removeProduct(id, productId);
            res.json(r);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // --- Public ---
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const sc = await SalesChannelService.getSalesChannelById(id);
            if (!sc) return res.status(404).json({ error: 'SalesChannel not found' });
            res.json(sc);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async getAll(req, res) {
        try {
            const list = await SalesChannelService.getAllSalesChannels();
            res.json(list);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async getProducts(req, res) {
        try {
            const { id } = req.params;
            const products = await SalesChannelService.getChannelProducts(id);
            res.json(products);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
};

module.exports = SalesChannelController;
