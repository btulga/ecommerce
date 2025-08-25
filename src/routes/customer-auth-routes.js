// src/routes/customer-auth-routes.js
const express = require('express');
const CustomerAuthController = require('../controllers/customer-auth.controller');
const { authRequired } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public (customer login)
router.post('/customer/auth/login', CustomerAuthController.login);

// Protected (JWT)
router.get('/customer/auth/me', authRequired, CustomerAuthController.me);

module.exports = router;
