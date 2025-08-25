// src/routes/discount-routes.js
const express = require('express');
const DiscountController = require('../controllers/discount.controller');

const router = express.Router();

// --- Admin ---
router.post('/admin/discounts', DiscountController.create);
router.put('/admin/discounts/:id', DiscountController.update);
router.delete('/admin/discounts/:id', DiscountController.remove);
router.get('/admin/discounts/:id', DiscountController.getOneAdmin);
router.get('/admin/discounts', DiscountController.getAllAdmin);

// --- Public ---
router.get('/discounts', DiscountController.getAll);
router.get('/discounts/:id', DiscountController.getOne);

module.exports = router;
