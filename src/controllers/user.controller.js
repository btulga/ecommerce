// src/controllers/user.controller.js
const UserService = require('../services/user.service');

const UserController = {
    // ------- Self -------
    async me(req, res) {
        try {
            const user = await UserService.getMe(req.user.id);
            res.json(user);
        } catch (e) { res.status(404).json({ error: e.message }); }
    },

    async updateMe(req, res) {
        try {
            const user = await UserService.updateMe(req.user.id, req.body);
            res.json(user);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async changeMyPassword(req, res) {
        try {
            const { current_password, new_password } = req.body;
            const r = await UserService.changePassword(req.user.id, { current_password, new_password }, { requireCurrent: true });
            res.json(r);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // ------- Admin manage users -------
    async create(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json(user);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async list(req, res) {
        try {
            const data = await UserService.list({
                q: req.query.q,
                email: req.query.email,
                status: req.query.status,
                hasRole: req.query.hasRole, // ж: ADMIN, USER
                limit: req.query.limit,
                offset: req.query.offset,
                includeDeleted: ['1','true','yes'].includes(String(req.query.includeDeleted).toLowerCase()),
            });
            res.json(data);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async getOne(req, res) {
        try {
            const user = await UserService.getById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async update(req, res) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            res.json(user);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async adminChangePassword(req, res) {
        try {
            const { new_password } = req.body;
            if (!new_password) throw new Error('new_password is required');
            const r = await UserService.changePassword(req.params.id, { new_password }, { requireCurrent: false });
            res.json(r);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setStatus(req, res) {
        try {
            const user = await UserService.setStatus(req.params.id, req.body.status);
            res.json(user);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setRoles(req, res) {
        try {
            const user = await UserService.setRoles(req.params.id, req.body.roles || []);
            res.json(user);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async softDelete(req, res) {
        try {
            await UserService.softDelete(req.params.id);
            res.status(204).send();
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async restore(req, res) {
        try {
            const user = await UserService.restore(req.params.id, req.body.toStatus || 'inactive');
            res.json(user);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },
};

module.exports = UserController;
