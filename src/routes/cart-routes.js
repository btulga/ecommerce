// src/routes/cart-routes.js
const express = require('express');
const CartController = require('../controllers/cart.controller');
const { authRequired, adminOrUserManager } = require('../middlewares/auth.middleware');

const router = express.Router();

/** Public / shared */
router.post('/carts', CartController.create);
router.get('/carts/:id', CartController.getOne);

// Customer-ийн идэвхтэй cart (admin-аас эсвэл хэрэглэгч өөрөө ч дуудах боломжтой)
router.get('/admin/customers/:customerId/active-cart', authRequired, adminOrUserManager, CartController.getActiveByCustomer);

// Cart settings
router.post('/carts/:id/customer', CartController.setCustomer);          // body: { customer_id }
router.post('/carts/:id/currency', CartController.setCurrency);          // body: { currency_code }

// Items
router.post('/carts/:id/items', CartController.addItem);                 // body: { variant_id, quantity?, unit_price?, metadata? }
router.put('/carts/:id/items/:itemId', CartController.updateItemQty);    // body: { quantity }
router.delete('/carts/:id/items/:itemId', CartController.removeItem);

// Addresses (snapshot)
router.post('/carts/:id/shipping-address/:addressId', CartController.setShippingAddress);
router.post('/carts/:id/billing-address/:addressId', CartController.setBillingAddress);

// Totals / Status / Metadata
router.post('/carts/:id/override-totals', CartController.overrideTotals); // body: { shipping_total?, discount_total?, tax_total? }
router.patch('/carts/:id/status', CartController.setStatus);              // body: { status }
router.patch('/carts/:id/metadata', CartController.setMetadata);          // body: { metadata }

module.exports = router;
