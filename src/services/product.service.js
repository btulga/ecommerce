// src/services/product.service.js
const db = require('../models');
const { Product, ProductOption, ProductOptionValue, ProductVariant, Category, Collection, Tag } = db;

const ProductService = {
    async createProduct(data) {
        return await Product.create(data);
    },

    async getProductById(id) {
        return await Product.findByPk(id, {
            include: [
                { model: ProductOption, as: 'options', include: [{ model: ProductOptionValue, as: 'values' }] },
                { model: ProductVariant, as: 'variants' },
                { model: Category, as: 'categories' },
                { model: Collection, as: 'collections' },
                { model: Tag, as: 'tags' },
            ],
        });
    },

    async getAllProducts() {
        return await Product.findAll({
            include: [{ model: ProductVariant, as: 'variants' }],
        });
    },

    async updateProduct(id, updates) {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        return await product.update(updates);
    },

    async deleteProduct(id) {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        await product.destroy();
        return true;
    },
};

module.exports = ProductService;
