const express = require('express');
const router = express.Router();

// Import existing routes
const userRoutes = require('./user-routes');
const cartRoutes = require('./cart-routes');
const addressRoutes = require('./address-routes.js');
const couponRoutes = require('./coupon-routes.js'); // Import new coupon routes
const productVariantRoutes = require('./product-variant-routes'); // Import product variant routes\nconst productCategoryRoutes = require('./product-category-routes'); // Import product category routes

// Register routes
router.use('/users', userRoutes);
router.use('/carts', cartRoutes);
router.use('/addresses', addressRoutes);
router.use('/coupons', couponRoutes); // Register coupon routes under /coupons
router.use('/product-variants', productVariantRoutes); // Register product variant routes under /product-variants
router.use('/product-categories', productCategoryRoutes); // Register product category routes under /product-categories

module.exports = router;
