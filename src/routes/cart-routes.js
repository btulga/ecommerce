const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');

// Create a new cart
router.post('/', CartController.createCart);

// Get a cart by ID
router.get('/:id', CartController.getCart);

// Add or update item in cart
router.post('/:id/items', CartController.addOrUpdateItem);

// Remove item from cart
router.delete('/:cartId/items/:itemId', CartController.removeItem);

// Apply coupon to cart
router.post('/:id/coupon', CartController.applyCoupon);

// TODO: Add routes for setting shipping/payment, completing cart, etc.

module.exports = router;
