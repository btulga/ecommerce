// src/services/discount.service.js
const db = require('../models');
const { Discount } = db;

const DiscountService = {
    async createDiscount(data) {
        return await Discount.create(data);
    },

    async getDiscountById(id) {
        return await Discount.findByPk(id);
    },

    async getAllDiscounts() {
        return await Discount.findAll();
    },

    async updateDiscount(id, updates) {
        const discount = await Discount.findByPk(id);
        if (!discount) throw new Error('Discount not found');
        return await discount.update(updates);
    },

    async deleteDiscount(id) {
        const discount = await Discount.findByPk(id);
        if (!discount) throw new Error('Discount not found');
        await discount.destroy();
        return true;
    },
};

module.exports = DiscountService;
