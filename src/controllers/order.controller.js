// src/controllers/order.controller.js
const OrderService = require('../services/order.service');

const OrderController = {
    // ------------ Reads ------------
    async getOne(req, res) {
        try {
            const row = await OrderService.getById(req.params.id);
            if (!row) return res.status(404).json({ error: 'Order not found' });
            res.json(row);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async list(req, res) {
        try {
            const {
                q, status, customer_id, date_from, date_to, limit, offset,
            } = req.query;

            const data = await OrderService.list({
                q, status, customer_id, date_from, date_to, limit, offset,
            });
            res.json(data);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    // ------------ Create ------------
    async createFromCart(req, res) {
        try {
            const { cart_id, metadata } = req.body;
            if (!cart_id) throw new Error('cart_id is required');
            const row = await OrderService.createFromCart(cart_id, { metadata });
            res.status(201).json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async create(req, res) {
        try {
            const row = await OrderService.create(req.body);
            res.status(201).json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // ------------ Payments ------------
    async addPayment(req, res) {
        try {
            const row = await OrderService.addPayment(req.params.id, req.body);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async markPaid(req, res) {
        try {
            const row = await OrderService.markPaid(req.params.id);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // ------------ Status / Addresses / Metadata ------------
    async setStatus(req, res) {
        try {
            const row = await OrderService.setStatus(req.params.id, req.body.status);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setAddresses(req, res) {
        try {
            // body: { shipping_address_id?, billing_address_id?, shipping_address?, billing_address? }
            const row = await OrderService.setAddresses(req.params.id, req.body);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setMetadata(req, res) {
        try {
            const row = await OrderService.setMetadata(req.params.id, req.body.metadata || {});
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // ------------ Cancel ------------
    async cancel(req, res) {
        try {
            const row = await OrderService.cancel(req.params.id, {
                reason: req.body.reason,
                restock: req.body.restock !== false, // default true
            });
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },
};

module.exports = OrderController;
