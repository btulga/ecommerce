// src/controllers/customer-sales-channel.controller.js
const CustomerSalesChannelService = require('../services/customer-sales-channel.service');

const CustomerSalesChannelController = {
    // --- Admin: link/unlink & sync ---
    async addToChannel(req, res) {
        try {
            const { customerId, channelId } = req.params;
            const r = await CustomerSalesChannelService.addCustomerToChannel(customerId, channelId);
            res.json(r);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async removeFromChannel(req, res) {
        try {
            const { customerId, channelId } = req.params;
            const r = await CustomerSalesChannelService.removeCustomerFromChannel(customerId, channelId);
            res.json(r);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    async setChannelsForCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const { channels = [] } = req.body; // array of sales_channel ids
            const rows = await CustomerSalesChannelService.setChannelsForCustomer(customerId, channels);
            res.json(rows);
        } catch (e) { res.status(400).json({ error: e.message }); }
    },

    // --- Readonly ---
    async listChannelsOfCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const rows = await CustomerSalesChannelService.listChannelsOfCustomer(customerId);
            res.json(rows);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },

    async listCustomersInChannel(req, res) {
        try {
            const { channelId } = req.params;
            const rows = await CustomerSalesChannelService.listCustomersInChannel(channelId);
            res.json(rows);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },
};

module.exports = CustomerSalesChannelController;
