// src/routes/coupon-routes.js
const express = require('express');
const CouponController = require('../controllers/coupon.controller');

const router = express.Router();

/**
 * Admin endpoints
 */
router.post('/admin/coupons', CouponController.create);
router.put('/admin/coupons/:id', CouponController.update);
router.delete('/admin/coupons/:id', CouponController.remove);
router.get('/admin/coupons', CouponController.listAdmin);
router.get('/admin/coupons/:id', CouponController.getOneAdmin);
router.patch('/admin/coupons/:id/active', CouponController.setActive);

// Benefits
router.post('/admin/coupons/:id/benefits', CouponController.addBenefit);
router.put('/admin/coupons/:id/benefits/:benefitId', CouponController.updateBenefit);
router.delete('/admin/coupons/:id/benefits/:benefitId', CouponController.removeBenefit);

// Conditions
router.post('/admin/coupons/:id/conditions', CouponController.addCondition);
router.put('/admin/coupons/:id/conditions/:conditionId', CouponController.updateCondition);
router.delete('/admin/coupons/:id/conditions/:conditionId', CouponController.removeCondition);

/**
 * Public endpoints
 */
router.get('/coupons', CouponController.list);
router.get('/coupons/:id', CouponController.getOne);
router.get('/coupons/code/:code', CouponController.getByCode);

module.exports = router;
