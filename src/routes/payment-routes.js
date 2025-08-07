const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');

/**
 * This route is for receiving webhooks from payment providers.
 * POST /payments/webhook/:providerId
 * It's essential to secure this endpoint, typically by verifying a signature
 * provided in the request headers.
 */
router.post('/webhook/:providerId', PaymentController.handleWebhook);

module.exports = router;
