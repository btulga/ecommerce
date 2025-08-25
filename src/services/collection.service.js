// src/services/collection.service.js
const db = require('../models');
const { Collection, Product } = db;

const CollectionService = {
    /**
     * Collection үүсгэх
     */
    async createCollection(data) {
        return await Collection.create(data);
    },

    /**
     * Нэг collection авах
     */
    async getCollectionById(id) {
        return await Collection.findByPk(id, {
            include: [{ model: Product, as: 'products' }],
        });
    },

    /**
     * Бүх collections авах
     */
    async getAllCollections() {
        return await Collection.findAll({
            include: [{ model: Product, as: 'products' }],
        });
    },

    /**
     * Collection update хийх
     */
    async updateCollection(id, updates) {
        const collection = await Collection.findByPk(id);
        if (!collection) throw new Error('Collection not found');
        return await collection.update(updates);
    },

    /**
     * Collection устгах
     */
    async deleteCollection(id) {
        const collection = await Collection.findByPk(id);
        if (!collection) throw new Error('Collection not found');
        await collection.destroy();
        return true;
    },

    /**
     * Product-ийг collection-д нэмэх
     */
    async addProductToCollection(collectionId, productId) {
        const collection = await Collection.findByPk(collectionId);
        if (!collection) throw new Error('Collection not found');

        const product = await Product.findByPk(productId);
        if (!product) throw new Error('Product not found');

        await collection.addProduct(product);
        return await this.getCollectionById(collectionId);
    },

    /**
     * Product-ийг collection-с хасах
     */
    async removeProductFromCollection(collectionId, productId) {
        const collection = await Collection.findByPk(collectionId);
        if (!collection) throw new Error('Collection not found');

        const product = await Product.findByPk(productId);
        if (!product) throw new Error('Product not found');

        await collection.removeProduct(product);
        return await this.getCollectionById(collectionId);
    },
};

module.exports = CollectionService;
