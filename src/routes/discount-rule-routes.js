import { Router } from 'express';
import {
  createDiscountRule,
  getDiscountRuleById,
  updateDiscountRule,
  deleteDiscountRule,
  addProductToDiscountRule,
  removeProductFromDiscountRule,
  addSalesChannelToDiscountRule,
  removeSalesChannelFromDiscountRule,
} from '../controllers/discount-rule.controller';

const discountRuleRouter = Router();

discountRuleRouter.post('/', createDiscountRule);
discountRuleRouter.get('/:id', getDiscountRuleById);
discountRuleRouter.put('/:id', updateDiscountRule);
discountRuleRouter.delete('/:id', deleteDiscountRule);
discountRuleRouter.post('/:id/products', addProductToDiscountRule);
discountRuleRouter.delete('/:id/products/:productId', removeProductFromDiscountRule);
discountRuleRouter.post('/:id/sales-channels', addSalesChannelToDiscountRule);
discountRuleRouter.delete('/:id/sales-channels/:salesChannelId', removeSalesChannelFromSalesChannel);

export default discountRuleRouter;
