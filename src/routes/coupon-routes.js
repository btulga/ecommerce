const express = require('express');
const router = express.Router();
const CouponController = require('../controllers/coupon.controller');

// Create a new coupon (and its associated discount rule)
// POST /coupons
router.post('/', CouponController.createCoupon);

// Get a coupon by ID
// GET /coupons/:id
router.get('/:id', CouponController.getCoupon);

// A route to validate a coupon against a cart context
// This is more for direct validation checks
// POST /coupons/validate
router.post('/validate', CouponController.validateForCart);

module.exports = router;
