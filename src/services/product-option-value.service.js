// src/services/product-option-value.service.js
const db = require('../models');
const { ProductOptionValue } = db;

const ProductOptionValueService = {
    async createOptionValue(optionId, data) {
        return await ProductOptionValue.create({ ...data, option_id: optionId });
    },

    async getOptionValueById(id) {
        return await ProductOptionValue.findByPk(id);
    },

    async updateOptionValue(id, updates) {
        const value = await ProductOptionValue.findByPk(id);
        if (!value) throw new Error('Product option value not found');
        return await value.update(updates);
    },

    async deleteOptionValue(id) {
        const value = await ProductOptionValue.findByPk(id);
        if (!value) throw new Error('Product option value not found');
        await value.destroy();
        return true;
    },
};

module.exports = ProductOptionValueService;
