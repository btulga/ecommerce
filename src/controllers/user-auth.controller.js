// src/controllers/user-auth.controller.js
const UserAuthService = require('../services/user-auth.service');

const UserAuthController = {
    async login(req, res) {
        try {
            const result = await UserAuthService.login(req.body); // { email, password }
            res.json(result);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async me(req, res) {
        try {
            const user = await UserAuthService.me(req.user.id);
            res.json(user);
        } catch (e) {
            res.status(404).json({ error: e.message });
        }
    },
};

module.exports = UserAuthController;
