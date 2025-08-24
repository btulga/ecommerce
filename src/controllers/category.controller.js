// src/controllers/category.controller.js
const CategoryService = require('../services/category.service');

const CategoryController = {
    /**
     * Root category нэмэх
     */
    async createRootCategory(req, res) {
        try {
            const category = await CategoryService.createRootCategory(req.body);
            res.status(201).json(category);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    /**
     * Хүүхэд category нэмэх
     */
    async createChildCategory(req, res) {
        try {
            const { parentId } = req.params;
            const category = await CategoryService.createChildCategory(parentId, req.body);
            res.status(201).json(category);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    /**
     * Бүх мод бүтцээр нь авах
     */
    async getTree(req, res) {
        try {
            const tree = await CategoryService.getTree();
            res.json(tree);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    /**
     * Нэг category-ийн subtree авах
     */
    async getSubtree(req, res) {
        try {
            const { id } = req.params;
            const subtree = await CategoryService.getSubtree(id);
            res.json(subtree);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    /**
     * Category update
     */
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const updated = await CategoryService.updateCategory(id, req.body);
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    /**
     * Category delete
     */
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await CategoryService.deleteCategory(id);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};

module.exports = CategoryController;
