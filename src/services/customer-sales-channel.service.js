// src/services/customer-sales-channel.service.js
const db = require('../models');
const { Customer, SalesChannel } = db;

const CustomerSalesChannelService = {
    /**
     * Customer-г sales channel-д нэмэх
     */
    async addCustomerToChannel(customerId, channelId) {
        const [cust, ch] = await Promise.all([
            Customer.findByPk(customerId),
            SalesChannel.findByPk(channelId),
        ]);
        if (!cust) throw new Error('Customer not found');
        if (!ch) throw new Error('SalesChannel not found');

        // Customer.belongsToMany(SalesChannel, { as: 'sales_channels', through: 'customer_sales_channel' })
        await cust.addSales_channel(ch);
        return { ok: true };
    },

    /**
     * Customer-г sales channel-с хасах
     */
    async removeCustomerFromChannel(customerId, channelId) {
        const [cust, ch] = await Promise.all([
            Customer.findByPk(customerId),
            SalesChannel.findByPk(channelId),
        ]);
        if (!cust) throw new Error('Customer not found');
        if (!ch) throw new Error('SalesChannel not found');

        await cust.removeSales_channel(ch);
        return { ok: true };
    },

    /**
     * Нэг customer-ийн бүх sales channel-ууд
     */
    async listChannelsOfCustomer(customerId) {
        const cust = await Customer.findByPk(customerId, {
            include: [{ model: SalesChannel, as: 'sales_channels' }],
        });
        if (!cust) throw new Error('Customer not found');
        return cust.sales_channels || [];
    },

    /**
     * Нэг channel дахь бүх customers
     */
    async listCustomersInChannel(channelId) {
        const ch = await SalesChannel.findByPk(channelId, {
            include: [{ model: Customer, as: 'customers' }], // доорх sanitize-г үзнэ үү
        });
        if (!ch) throw new Error('SalesChannel not found');
        return ch.customers || [];
    },

    /**
     * Channels sync (өгөгдсөн channelIds-ыг customer дээр бүрэн тольдож тохируулах)
     */
    async setChannelsForCustomer(customerId, channelIds = []) {
        const cust = await Customer.findByPk(customerId);
        if (!cust) throw new Error('Customer not found');

        const channels = await SalesChannel.findAll({ where: { id: channelIds } });
        await cust.setSales_channels(channels);
        return await this.listChannelsOfCustomer(customerId);
    },
};

module.exports = CustomerSalesChannelService;
