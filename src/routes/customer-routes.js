// src/routes/customer-routes.js
const express = require('express');
const CustomerController = require('../controllers/customer.controller');
const { authRequired, adminOnly, adminOrUserManager } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Public endpoints
 */
router.get('/customers', CustomerController.list);
router.get('/customers/:id', CustomerController.getOne);

/**
 * Admin endpoints
 */
router.post('/admin/customers', authRequired, adminOrUserManager, CustomerController.create);
router.put('/admin/customers/:id', authRequired, adminOrUserManager, CustomerController.update);
router.delete('/admin/customers/:id', authRequired, adminOrUserManager, CustomerController.softDelete);
router.post('/admin/customers/:id/restore', authRequired, adminOrUserManager, CustomerController.restore);
router.patch('/admin/customers/:id/status', authRequired, adminOrUserManager, CustomerController.setStatus);

module.exports = router;
