// src/controllers/customer-auth.controller.js
const CustomerAuthService = require('../services/customer-auth.service');

const CustomerAuthController = {
    async login(req, res) {
        try {
            const result = await CustomerAuthService.login(req.body); // { email, password }
            res.json(result); // { token, customer }
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async me(req, res) {
        try {
            const me = await CustomerAuthService.me(req.user.id);
            res.json(me);
        } catch (e) {
            res.status(404).json({ error: e.message });
        }
    },
};

module.exports = CustomerAuthController;
