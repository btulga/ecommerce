// src/routes/collection-routes.js
const express = require('express');
const CollectionController = require('../controllers/collection.controller');

const router = express.Router();

// --- Admin Endpoints ---
router.post('/admin/collections', CollectionController.createCollection);
router.put('/admin/collections/:id', CollectionController.updateCollection);
router.delete('/admin/collections/:id', CollectionController.deleteCollection);

// Product холбоо
router.post('/admin/collections/:id/products/:productId', CollectionController.addProduct);
router.delete('/admin/collections/:id/products/:productId', CollectionController.removeProduct);

// --- Public Endpoints ---
router.get('/collections', CollectionController.getAllCollections);
router.get('/collections/:id', CollectionController.getCollectionById);

module.exports = router;
