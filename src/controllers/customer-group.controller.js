// src/controllers/customer-group.controller.js
const CustomerGroupService = require('../services/customer-group.service');

const CustomerGroupController = {
    // --- Admin CRUD ---
    async create(req, res) {
        try {
            const row = await CustomerGroupService.createGroup(req.body);
            res.status(201).json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const row = await CustomerGroupService.updateGroup(id, req.body);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            await CustomerGroupService.deleteGroup(id);
            res.status(204).send();
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async getOneAdmin(req, res) {
        try {
            const { id } = req.params;
            const row = await CustomerGroupService.getGroupById(id);
            if (!row) return res.status(404).json({ error: 'CustomerGroup not found' });
            res.json(row);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async listAdmin(req, res) {
        try {
            const withCustomers = ['1','true','yes'].includes(String(req.query.withCustomers).toLowerCase());
            const rows = await CustomerGroupService.listGroups({ withCustomers });
            res.json(rows);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    // --- Admin: memberships ---
    async addCustomer(req, res) {
        try {
            const { id, customerId } = req.params;
            const row = await CustomerGroupService.addCustomer(id, customerId);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async removeCustomer(req, res) {
        try {
            const { id, customerId } = req.params;
            const row = await CustomerGroupService.removeCustomer(id, customerId);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setCustomers(req, res) {
        try {
            const { id } = req.params;
            const { customers = [] } = req.body; // array of customer ids
            const row = await CustomerGroupService.setCustomers(id, customers);
            res.json(row);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // --- Public (readonly) ---
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const row = await CustomerGroupService.getGroupById(id);
            if (!row) return res.status(404).json({ error: 'CustomerGroup not found' });
            res.json(row);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async list(req, res) {
        try {
            const rows = await CustomerGroupService.listGroups({ withCustomers: false });
            res.json(rows);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },
};

module.exports = CustomerGroupController;
