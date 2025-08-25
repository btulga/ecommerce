// src/services/product.service.js
const db = require('../models');
const { Product, ProductOption, ProductVariant, Category, Collection, Tag } = db;

const ProductService = {
    /**
     * Product үүсгэх + tags, categories автоматаар холбох
     */
    async createProduct(data) {
        const { tags, categories, ...productData } = data;

        // Product үүсгэх
        const product = await Product.create(productData);

        // --- Tags холбоо ---
        if (tags && Array.isArray(tags) && tags.length > 0) {
            const tagInstances = [];
            for (const tagName of tags) {
                let tag = await Tag.findOne({ where: { name: tagName } });
                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }
                tagInstances.push(tag);
            }
            await product.addTags(tagInstances);
        }

        // --- Categories холбоо ---
        if (categories && Array.isArray(categories) && categories.length > 0) {
            const categoryInstances = await Category.findAll({
                where: { id: categories },
            });
            await product.addCategories(categoryInstances);
        }

        return await this.getProductById(product.id);
    },

    /**
     * Product update + tags, categories sync
     */
    async updateProduct(id, updates) {
        const { tags, categories, ...productData } = updates;

        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');

        // Product талбаруудыг шинэчлэх
        await product.update(productData);

        // --- Tags sync ---
        if (tags && Array.isArray(tags)) {
            const tagInstances = [];
            for (const tagName of tags) {
                let tag = await Tag.findOne({ where: { name: tagName } });
                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }
                tagInstances.push(tag);
            }
            await product.setTags(tagInstances);
        }

        // --- Categories sync ---
        if (categories && Array.isArray(categories)) {
            const categoryInstances = await Category.findAll({
                where: { id: categories },
            });
            await product.setCategories(categoryInstances);
        }

        return await this.getProductById(id);
    },

    /**
     * Product устгах
     */
    async deleteProduct(id) {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        await product.destroy();
        return true;
    },

    /**
     * Product by id авах
     */
    async getProductById(id) {
        return await Product.findByPk(id, {
            include: [
                { model: ProductOption, as: 'options', include: [{ model: db.ProductOptionValue, as: 'values' }] },
                { model: ProductVariant, as: 'variants' },
                { model: Category, as: 'categories' },
                { model: Collection, as: 'collections' },
                { model: Tag, as: 'tags' },
            ],
        });
    },

    /**
     * Бүх products авах
     */
    async getAllProducts() {
        return await Product.findAll({
            include: [
                { model: ProductVariant, as: 'variants' },
                { model: Category, as: 'categories' },
                { model: Tag, as: 'tags' },
            ],
        });
    },

    /**
     * Tag үүсгэх
     */
    async createTag(name) {
        return await Tag.create({ name });
    },

    /**
     * Product-д tag нэмэх
     */
    async addTagToProduct(productId, tagId) {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error('Product not found');

        const tag = await Tag.findByPk(tagId);
        if (!tag) throw new Error('Tag not found');

        await product.addTag(tag);
        return await this.getProductById(productId);
    },

    /**
     * Product-с tag устгах
     */
    async removeTagFromProduct(productId, tagId) {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error('Product not found');

        const tag = await Tag.findByPk(tagId);
        if (!tag) throw new Error('Tag not found');

        await product.removeTag(tag);
        return await this.getProductById(productId);
    },
};

module.exports = ProductService;
