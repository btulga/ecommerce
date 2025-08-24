// src/routes/category-routes.js
const express = require('express');
const CategoryController = require('../controllers/category.controller');

const router = express.Router();

// --- Admin API --- //
router.post('/admin/categories/root', CategoryController.createRootCategory);
router.post('/admin/categories/:parentId/children', CategoryController.createChildCategory);
router.put('/admin/categories/:id', CategoryController.updateCategory);
router.delete('/admin/categories/:id', CategoryController.deleteCategory);

// --- Public API --- //
router.get('/categories/tree', CategoryController.getTree);
router.get('/categories/:id/subtree', CategoryController.getSubtree);

module.exports = router;
