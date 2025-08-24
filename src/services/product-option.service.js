// src/services/product-option.service.js
const db = require('../models');
const { ProductOption, ProductOptionValue } = db;

const ProductOptionService = {
    async createOption(productId, data) {
        return await ProductOption.create({ ...data, product_id: productId });
    },

    async getOptionById(id) {
        return await ProductOption.findByPk(id, {
            include: [{ model: ProductOptionValue, as: 'values' }],
        });
    },

    async updateOption(id, updates) {
        const option = await ProductOption.findByPk(id);
        if (!option) throw new Error('Product option not found');
        return await option.update(updates);
    },

    async deleteOption(id) {
        const option = await ProductOption.findByPk(id);
        if (!option) throw new Error('Product option not found');
        await option.destroy();
        return true;
    },
};

module.exports = ProductOptionService;
