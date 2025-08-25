// src/services/sales-channel.service.js
const db = require('../models');
const { SalesChannel, Product } = db;

const SalesChannelService = {
    // --- CRUD ---
    async createSalesChannel(data) {
        return await SalesChannel.create(data);
    },

    async getSalesChannelById(id) {
        // Хэрэв SalesChannel моделдоо Product-той belongsToMany холбоо зарлаагүй бол
        // бүтээгдэхүүнүүдийг тусдаа API-аар include-гүй авч байна.
        return await SalesChannel.findByPk(id);
    },

    async getAllSalesChannels() {
        return await SalesChannel.findAll();
    },

    async updateSalesChannel(id, updates) {
        const sc = await SalesChannel.findByPk(id);
        if (!sc) throw new Error('SalesChannel not found');
        return await sc.update(updates);
    },

    async deleteSalesChannel(id) {
        const sc = await SalesChannel.findByPk(id);
        if (!sc) throw new Error('SalesChannel not found');
        await sc.destroy();
        return true;
    },

    // --- Products холбоо (Product талын association-ыг ашиглана) ---
    async addProduct(channelId, productId) {
        const [channel, product] = await Promise.all([
            SalesChannel.findByPk(channelId),
            Product.findByPk(productId),
        ]);
        if (!channel) throw new Error('SalesChannel not found');
        if (!product) throw new Error('Product not found');

        // Product модел дээр:
        // Product.belongsToMany(models.SalesChannel, { as: 'sales_channels', through: 'product_sales_channel', ... })
        // тул addSales_channel / addSales_channels accessor-ууд үүснэ.
        await product.addSales_channel(channel);
        return { ok: true };
    },

    async removeProduct(channelId, productId) {
        const [channel, product] = await Promise.all([
            SalesChannel.findByPk(channelId),
            Product.findByPk(productId),
        ]);
        if (!channel) throw new Error('SalesChannel not found');
        if (!product) throw new Error('Product not found');

        await product.removeSales_channel(channel);
        return { ok: true };
    },

    // Каналын бүтээгдэхүүнүүд (include ашиглан Product-уудаас шүүх)
    async getChannelProducts(channelId) {
        // Product-оос SalesChannel as: 'sales_channels' дагуу шүүнэ
        return await Product.findAll({
            include: [{
                model: SalesChannel,
                as: 'sales_channels',
                where: { id: channelId },
                attributes: [], // зөвхөн шүүхэд ашиглаад буцаахгүй
                through: { attributes: [] },
                required: true,
            }],
        });
    },
};

module.exports = SalesChannelService;
