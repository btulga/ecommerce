const { Router } = require('express');
const {
  createDiscountRule,
  getDiscountRuleById,
  updateDiscountRule,
  deleteDiscountRule,
  addProductToDiscountRule,
  removeProductFromDiscountRule,
  addSalesChannelToDiscountRule,
  removeSalesChannelFromSalesChannel, // Assuming this should be consistent with usage below
} = require('../controllers/discount-rule.controller');

const router = Router();

router.post('/', createDiscountRule);
router.get('/:id', getDiscountRuleById);
router.put('/:id', updateDiscountRule);
router.delete('/:id', deleteDiscountRule);
router.post('/:id/products', addProductToDiscountRule);
router.delete('/:id/products/:productId', removeProductFromDiscountRule);
router.post('/:id/sales-channels', addSalesChannelToDiscountRule);
router.delete('/:id/sales-channels/:salesChannelId', removeSalesChannelFromSalesChannel);

module.exports = router;
