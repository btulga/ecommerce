// src/routes/promotion-routes.js
const express = require('express');
const PromotionController = require('../controllers/promotion.controller');

const router = express.Router();

/** Admin */
router.post('/admin/promotions', PromotionController.create);
router.put('/admin/promotions/:id', PromotionController.update);
router.delete('/admin/promotions/:id', PromotionController.remove);

router.get('/admin/promotions', PromotionController.listAdmin);
router.get('/admin/promotions/:id', PromotionController.getOneAdmin);

// Conditions
router.post('/admin/promotions/:id/conditions', PromotionController.addCondition);
router.put('/admin/promotions/:id/conditions/:conditionId', PromotionController.updateCondition);
router.delete('/admin/promotions/:id/conditions/:conditionId', PromotionController.removeCondition);

// Benefits
router.post('/admin/promotions/:id/benefits', PromotionController.addBenefit);
router.put('/admin/promotions/:id/benefits/:benefitId', PromotionController.updateBenefit);
router.delete('/admin/promotions/:id/benefits/:benefitId', PromotionController.removeBenefit);

/** Public (readonly) */
router.get('/promotions', PromotionController.list);
router.get('/promotions/:id', PromotionController.getOne);

module.exports = router;
