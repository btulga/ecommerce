// src/services/product.service.js
const db = require('../models');
const { Product, ProductOption, ProductVariant, Category, Collection, Tag, SalesChannel } = db;

const ProductService = {
    /**
     * Product үүсгэх + tags, categories, sales_channels автоматаар холбох
     */
    async createProduct(data) {
        const { tags, categories, sales_channels, ...productData } = data;

        // Product үүсгэх
        const product = await Product.create(productData);

        // --- Tags ---
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

        // --- Categories ---
        if (categories && Array.isArray(categories) && categories.length > 0) {
            const categoryInstances = await Category.findAll({ where: { id: categories } });
            await product.addCategories(categoryInstances);
        }

        // --- Sales Channels ---
        if (sales_channels && Array.isArray(sales_channels) && sales_channels.length > 0) {
            const channelInstances = await SalesChannel.findAll({ where: { id: sales_channels } });
            await product.addSales_channels(channelInstances); // Sequelize дотор as нэршил нь sales_channels байгаа
        }

        return await this.getProductById(product.id);
    },

    /**
     * Product update + tags, categories, sales_channels sync
     */
    async updateProduct(id, updates) {
        const { tags, categories, sales_channels, ...productData } = updates;

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
            const categoryInstances = await Category.findAll({ where: { id: categories } });
            await product.setCategories(categoryInstances);
        }

        // --- Sales Channels sync ---
        if (sales_channels && Array.isArray(sales_channels)) {
            const channelInstances = await SalesChannel.findAll({ where: { id: sales_channels } });
            await product.setSales_channels(channelInstances);
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
                { model: SalesChannel, as: 'sales_channels' },
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
                { model: SalesChannel, as: 'sales_channels' },
                { model: Tag, as: 'tags' },
            ],
        });
    },
};

module.exports = ProductService;
