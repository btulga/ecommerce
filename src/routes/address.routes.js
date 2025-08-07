const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/address.controller');

// Note: These routes might be nested under /customers/:customerId/addresses in a real app
// For simplicity, we are creating top-level routes for addresses here.

// Create a new address
// POST /addresses
// Body should contain address data and customer_id
router.post('/', AddressController.createAddress);

// Get a specific address by its ID
// GET /addresses/:id
router.get('/:id', AddressController.getAddress);

// List all addresses for a specific customer
// GET /addresses/customer/:customerId
router.get('/customer/:customerId', AddressController.listAddresses);

// Update an address
// PUT /addresses/:id
router.put('/:id', AddressController.updateAddress);

// Delete an address
// DELETE /addresses/:id
router.delete('/:id', AddressController.deleteAddress);

module.exports = router;
