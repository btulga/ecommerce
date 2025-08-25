// src/routes/customer-group-routes.js
const express = require('express');
const Controller = require('../controllers/customer-group.controller');
const router = express.Router();

// Admin
router.post('/admin/customer-groups', Controller.create);
router.put('/admin/customer-groups/:id', Controller.update);
router.delete('/admin/customer-groups/:id', Controller.remove);

router.get('/admin/customer-groups', Controller.listAdmin);
router.get('/admin/customer-groups/:id', Controller.getOneAdmin);

// Memberships
router.post('/admin/customer-groups/:id/customers/:customerId', Controller.addCustomer);
router.delete('/admin/customer-groups/:id/customers/:customerId', Controller.removeCustomer);
router.put('/admin/customer-groups/:id/customers', Controller.setCustomers); // body: { customers: [] }

// Public (readonly)
router.get('/customer-groups', Controller.list);
router.get('/customer-groups/:id', Controller.getOne);

module.exports = router;
