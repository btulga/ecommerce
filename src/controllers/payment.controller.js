// src/controllers/payment.controller.js
const PaymentService = require('../services/payment.service');

const PaymentController = {
    // ---------- Reads ----------
    async getOne(req, res) {
        try {
            const row = await PaymentService.getById(req.params.id);
            if (!row) return res.status(404).json({ error: 'Payment not found' });
            res.json(row);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async list(req, res) {
        try {
            const { order_id, status, provider, date_from, date_to, limit, offset } = req.query;
            const data = await PaymentService.list({
                order_id, status, provider, date_from, date_to, limit, offset,
            });
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // ---------- Create ----------
    async create(req, res) {
        try {
            const { order_id } = req.body;
            if (!order_id) throw new Error('order_id is required');
            const row = await PaymentService.create(order_id, req.body);
            res.status(201).json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // ---------- Status changes ----------
    async markSucceeded(req, res) {
        try {
            const row = await PaymentService.markSucceeded(req.params.id, req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async markFailed(req, res) {
        try {
            const row = await PaymentService.markFailed(req.params.id, req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async void(req, res) {
        try {
            const row = await PaymentService.void(req.params.id, req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // ---------- Refund ----------
    async refund(req, res) {
        try {
            const row = await PaymentService.refund(req.params.id, req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // ---------- Metadata ----------
    async setMetadata(req, res) {
        try {
            const row = await PaymentService.setMetadata(req.params.id, req.body.metadata || {});
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },
};

module.exports = PaymentController;
