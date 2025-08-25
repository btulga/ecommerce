// src/routes/order-routes.js
const express = require('express');
const OrderController = require('../controllers/order.controller');
const { authRequired, adminOrUserManager } = require('../middlewares/auth.middleware');

const router = express.Router();

/** ---------- Admin endpoints ---------- */
// Read
router.get('/admin/orders', authRequired, adminOrUserManager, OrderController.list);
router.get('/admin/orders/:id', authRequired, adminOrUserManager, OrderController.getOne);

// Create
router.post('/admin/orders/from-cart', authRequired, adminOrUserManager, OrderController.createFromCart);
router.post('/admin/orders', authRequired, adminOrUserManager, OrderController.create);

// Payments
router.post('/admin/orders/:id/payments', authRequired, adminOrUserManager, OrderController.addPayment);
router.post('/admin/orders/:id/mark-paid', authRequired, adminOrUserManager, OrderController.markPaid);

// Status / Addresses / Metadata
router.patch('/admin/orders/:id/status', authRequired, adminOrUserManager, OrderController.setStatus);
router.post('/admin/orders/:id/addresses', authRequired, adminOrUserManager, OrderController.setAddresses);
router.patch('/admin/orders/:id/metadata', authRequired, adminOrUserManager, OrderController.setMetadata);

// Cancel
router.post('/admin/orders/:id/cancel', authRequired, adminOrUserManager, OrderController.cancel);

/** ---------- Public (optional) ---------- */
// Хэрэв захиалга харахыг зөвшөөрөх бол (owner шалгалт хийж ч болно)
router.get('/orders/:id', /* authRequired? owner check? */ OrderController.getOne);

module.exports = router;
