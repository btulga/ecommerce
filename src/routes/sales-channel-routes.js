// src/routes/sales-channel-routes.js
const express = require('express');
const SalesChannelController = require('../controllers/sales-channel.controller');

const router = express.Router();

/**
 * Admin endpoints
 */
router.post('/admin/sales-channels', SalesChannelController.create);
router.put('/admin/sales-channels/:id', SalesChannelController.update);
router.delete('/admin/sales-channels/:id', SalesChannelController.remove);

// Product холбоо
router.post('/admin/sales-channels/:id/products/:productId', SalesChannelController.addProduct);
router.delete('/admin/sales-channels/:id/products/:productId', SalesChannelController.removeProduct);

/**
 * Public endpoints
 */
router.get('/sales-channels', SalesChannelController.getAll);
router.get('/sales-channels/:id', SalesChannelController.getOne);
router.get('/sales-channels/:id/products', SalesChannelController.getProducts);

module.exports = router;
