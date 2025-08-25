// src/routes/inventory-routes.js
const express = require('express');
const InventoryController = require('../controllers/inventory.controller');
const router = express.Router();

// --- Admin (mutations) ---
router.post('/admin/inventory', InventoryController.createOrSet);              // variant_id, location_id, quantity, reserved?
router.post('/admin/inventory/set-quantity', InventoryController.setQuantity); // { variant_id, location_id, quantity }
router.post('/admin/inventory/adjust', InventoryController.adjustQuantity);    // { variant_id, location_id, delta }
router.post('/admin/inventory/reserve', InventoryController.reserve);          // { variant_id, location_id, qty }
router.post('/admin/inventory/release', InventoryController.releaseReservation); // { variant_id, location_id, qty }
router.post('/admin/inventory/commit', InventoryController.commitReservationToSale); // { variant_id, location_id, qty }
router.post('/admin/inventory/transfer', InventoryController.transfer);        // { variant_id, from_location_id, to_location_id, qty }

// --- Public (reads) ---
router.get('/inventory/:id', InventoryController.getOne);
router.get('/inventory/variant/:variantId', InventoryController.byVariant);
router.get('/inventory/location/:locationId', InventoryController.byLocation);
router.get('/inventory/availability/:variantId', InventoryController.availability);

module.exports = router;
