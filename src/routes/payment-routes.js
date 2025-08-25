// src/routes/payment-routes.js
const express = require('express');
const PaymentController = require('../controllers/payment.controller');
const { authRequired, adminOrUserManager } = require('../middlewares/auth.middleware');

const router = express.Router();

/** ---------- Admin endpoints ---------- */
router.get('/admin/payments', authRequired, adminOrUserManager, PaymentController.list);
router.get('/admin/payments/:id', authRequired, adminOrUserManager, PaymentController.getOne);

router.post('/admin/payments', authRequired, adminOrUserManager, PaymentController.create);

router.post('/admin/payments/:id/mark-succeeded', authRequired, adminOrUserManager, PaymentController.markSucceeded);
router.post('/admin/payments/:id/mark-failed', authRequired, adminOrUserManager, PaymentController.markFailed);
router.post('/admin/payments/:id/void', authRequired, adminOrUserManager, PaymentController.void);

router.post('/admin/payments/:id/refund', authRequired, adminOrUserManager, PaymentController.refund);

router.patch('/admin/payments/:id/metadata', authRequired, adminOrUserManager, PaymentController.setMetadata);

module.exports = router;
