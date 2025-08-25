// src/routes/address-routes.js
const express = require('express');
const AddressController = require('../controllers/address.controller');
const { authRequired, adminOrUserManager } = require('../middlewares/auth.middleware');

const router = express.Router();

/** Admin */
router.post('/admin/customers/:customerId/addresses', authRequired, adminOrUserManager, AddressController.createForCustomer);
router.get('/admin/customers/:customerId/addresses', authRequired, adminOrUserManager, AddressController.listByCustomerAdmin);
router.get('/admin/addresses/:id', authRequired, adminOrUserManager, AddressController.getOneAdmin);
router.put('/admin/addresses/:id', authRequired, adminOrUserManager, AddressController.updateAdmin);
router.delete('/admin/addresses/:id', authRequired, adminOrUserManager, AddressController.removeAdmin);
router.post('/admin/customers/:customerId/addresses/:addressId/default-shipping', authRequired, adminOrUserManager, AddressController.setDefaultShippingAdmin);
router.post('/admin/customers/:customerId/addresses/:addressId/default-billing', authRequired, adminOrUserManager, AddressController.setDefaultBillingAdmin);

/** Customer (self) */
router.get('/me/addresses', authRequired, AddressController.listMine);
router.post('/me/addresses', authRequired, AddressController.createMine);
router.put('/me/addresses/:id', authRequired, AddressController.updateMine);
router.delete('/me/addresses/:id', authRequired, AddressController.removeMine);
router.post('/me/addresses/:id/set-default-shipping', authRequired, AddressController.setDefaultShippingMine);
router.post('/me/addresses/:id/set-default-billing', authRequired, AddressController.setDefaultBillingMine);

module.exports = router;
