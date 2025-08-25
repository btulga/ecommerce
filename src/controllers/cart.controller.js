// src/controllers/cart.controller.js
const CartService = require('../services/cart.service');

const CartController = {
    // ---------- Reads ----------
    async getOne(req, res) {
        try {
            const cart = await CartService.getCartById(req.params.id);
            if (!cart) return res.status(404).json({ error: 'Cart not found' });
            res.json(cart);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async getActiveByCustomer(req, res) {
        try {
            const cart = await CartService.getActiveCartByCustomer(req.params.customerId);
            if (!cart) return res.status(404).json({ error: 'Active cart not found' });
            res.json(cart);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    // ---------- Create / Update ----------
    async create(req, res) {
        try {
            const cart = await CartService.createCart(req.body); // { customer_id?, currency_code?, metadata? }
            res.status(201).json(cart);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setCustomer(req, res) {
        try {
            const cart = await CartService.setCustomer(req.params.id, req.body.customer_id);
            res.json(cart);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setCurrency(req, res) {
        try {
            const cart = await CartService.setCurrency(req.params.id, req.body.currency_code);
            res.json(cart);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // ---------- Items ----------
    async addItem(req, res) {
        try {
            const item = await CartService.addItem(req.params.id, req.body); // { variant_id, quantity?, unit_price?, metadata? }
            res.status(201).json(item);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async updateItemQty(req, res) {
        try {
            const item = await CartService.updateItemQuantity(req.params.id, req.params.itemId, Number(req.body.quantity));
            res.json(item);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async removeItem(req, res) {
        try {
            await CartService.removeItem(req.params.id, req.params.itemId);
            res.status(204).send();
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // ---------- Addresses (snapshot) ----------
    async setShippingAddress(req, res) {
        try {
            const cart = await CartService.setShippingAddress(req.params.id, req.params.addressId);
            res.json(cart);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setBillingAddress(req, res) {
        try {
            const cart = await CartService.setBillingAddress(req.params.id, req.params.addressId);
            res.json(cart);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // ---------- Totals / Status / Metadata ----------
    async overrideTotals(req, res) {
        try {
            const cart = await CartService.overrideTotals(req.params.id, req.body); // { shipping_total?, discount_total?, tax_total? }
            res.json(cart);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setStatus(req, res) {
        try {
            const cart = await CartService.setStatus(req.params.id, req.body.status); // 'draft'|'active'|'completed'|'canceled'
            res.json(cart);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setMetadata(req, res) {
        try {
            const cart = await CartService.setMetadata(req.params.id, req.body.metadata || {});
            res.json(cart);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async checkout(req, res) {
        try {
            const order = await CartService.checkout(req.params.id, req.body);
            res.status(201).json(order);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },
};

module.exports = CartController;
