// src/controllers/address.controller.js
const AddressService = require('../services/address.service');

const AddressController = {
    // ---------- Admin ----------
    async createForCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const row = await AddressService.createAddress(customerId, req.body);
            res.status(201).json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async listByCustomerAdmin(req, res) {
        try {
            const { customerId } = req.params;
            const rows = await AddressService.listAddressesByCustomer(customerId);
            res.json(rows);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async getOneAdmin(req, res) {
        try {
            const row = await AddressService.getAddressById(req.params.id);
            if (!row) return res.status(404).json({ error: 'Address not found' });
            res.json(row);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async updateAdmin(req, res) {
        try {
            const row = await AddressService.updateAddress(req.params.id, req.body);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async removeAdmin(req, res) {
        try {
            await AddressService.deleteAddress(req.params.id);
            res.status(204).send();
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setDefaultShippingAdmin(req, res) {
        try {
            const { customerId, addressId } = req.params;
            const row = await AddressService.setDefaultShipping(customerId, addressId);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setDefaultBillingAdmin(req, res) {
        try {
            const { customerId, addressId } = req.params;
            const row = await AddressService.setDefaultBilling(customerId, addressId);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // ---------- Customer (self) ----------
    async listMine(req, res) {
        try {
            const rows = await AddressService.listAddressesByCustomer(req.user.id);
            res.json(rows);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async createMine(req, res) {
        try {
            const row = await AddressService.createAddress(req.user.id, req.body);
            res.status(201).json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async updateMine(req, res) {
        try {
            const row = await AddressService.updateAddress(req.params.id, req.body);
            // (сонголт) эзэмшигч таарч байгаа эсэхийг service талд шалгаж болно
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async removeMine(req, res) {
        try {
            await AddressService.deleteAddress(req.params.id);
            res.status(204).send();
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setDefaultShippingMine(req, res) {
        try {
            const row = await AddressService.setDefaultShipping(req.user.id, req.params.id);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setDefaultBillingMine(req, res) {
        try {
            const row = await AddressService.setDefaultBilling(req.user.id, req.params.id);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },
};

module.exports = AddressController;
