const express = require('express');
const router = express.Router();

// Import existing routes
const userRoutes = require('./userRoutes');
const cartRoutes = require('./cartRoutes');
const addressRoutes = require('./address.routes.js');
const couponRoutes = require('./coupon.routes.js'); // Import new coupon routes

// Register routes
router.use('/users', userRoutes);
router.use('/carts', cartRoutes);
router.use('/addresses', addressRoutes);
router.use('/coupons', couponRoutes); // Register coupon routes under /coupons

module.exports = router;
