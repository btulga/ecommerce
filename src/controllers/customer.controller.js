// src/controllers/customer.controller.js
const CustomerService = require('../services/customer.service');

const CustomerController = {
    // ----- Public / Self -----
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const customer = await CustomerService.getById(id, {
                withGroups: req.query.withGroups === 'true',
                withSalesChannels: req.query.withSalesChannels === 'true',
            });
            if (!customer) return res.status(404).json({ error: 'Customer not found' });
            res.json(customer);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async list(req, res) {
        try {
            const data = await CustomerService.list({
                q: req.query.q,
                email: req.query.email,
                phone: req.query.phone,
                status: req.query.status,
                created_from: req.query.created_from,
                created_to: req.query.created_to,
                includeDeleted: req.query.includeDeleted === 'true',
                limit: req.query.limit,
                offset: req.query.offset,
            }, {
                withGroups: req.query.withGroups === 'true',
                withSalesChannels: req.query.withSalesChannels === 'true',
            });
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    // ----- Admin manage -----
    async create(req, res) {
        try {
            const customer = await CustomerService.create(req.body);
            res.status(201).json(customer);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const customer = await CustomerService.update(id, req.body);
            res.json(customer);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async softDelete(req, res) {
        try {
            const { id } = req.params;
            await CustomerService.softDelete(id);
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async restore(req, res) {
        try {
            const { id } = req.params;
            const { toStatus } = req.body;
            const customer = await CustomerService.restore(id, toStatus || 'inactive');
            res.json(customer);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async setStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const customer = await CustomerService.setStatus(id, status);
            res.json(customer);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },
};

module.exports = CustomerController;
