// src/controllers/collection.controller.js
const CollectionService = require('../services/collection.service');

const CollectionController = {
    // --- Admin ---
    async createCollection(req, res) {
        try {
            const collection = await CollectionService.createCollection(req.body);
            res.status(201).json(collection);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async updateCollection(req, res) {
        try {
            const { id } = req.params;
            const updated = await CollectionService.updateCollection(id, req.body);
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async deleteCollection(req, res) {
        try {
            const { id } = req.params;
            await CollectionService.deleteCollection(id);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async addProduct(req, res) {
        try {
            const { id, productId } = req.params;
            const collection = await CollectionService.addProductToCollection(id, productId);
            res.json(collection);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async removeProduct(req, res) {
        try {
            const { id, productId } = req.params;
            const collection = await CollectionService.removeProductFromCollection(id, productId);
            res.json(collection);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // --- Public ---
    async getCollectionById(req, res) {
        try {
            const { id } = req.params;
            const collection = await CollectionService.getCollectionById(id);
            if (!collection) return res.status(404).json({ error: 'Collection not found' });
            res.json(collection);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getAllCollections(req, res) {
        try {
            const collections = await CollectionService.getAllCollections();
            res.json(collections);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = CollectionController;
