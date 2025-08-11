import {
  createDiscountRule as createDiscountRuleService,
  getDiscountRule as getDiscountRuleService,
  updateDiscountRule as updateDiscountRuleService,
  deleteDiscountRule as deleteDiscountRuleService,
  addProductToDiscountRule,
  removeProductFromDiscountRule,
  addSalesChannelToDiscountRule,
  removeSalesChannelFromDiscountRule,
} from '../services/discount-rule.service';

export const createDiscountRule = async (req, res) => {
  try {
    const discountRule = await createDiscountRuleService(req.body);
    res.status(201).json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiscountRule = async (req, res) => {
  try {
    const discountRule = await getDiscountRuleService(req.params.id);
    if (discountRule) {
      res.json(discountRule);
    } else {
      res.status(404).json({ message: 'Discount rule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDiscountRule = async (req, res) => {
  try {
    const updatedDiscountRule = await updateDiscountRuleService(req.params.id, req.body);
    if (updatedDiscountRule) {
      res.json(updatedDiscountRule);
    } else {
      res.status(404).json({ message: 'Discount rule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDiscountRule = async (req, res) => {
  try {
    const discountRule = await createDiscountRule(req.body);
    res.status(201).json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProductToDiscountRule = async (req, res) => {
  try {
    const { productId } = req.body;
    const discountRule = await addProductToDiscountRule(req.params.id, productId);
    res.json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const removeProductFromDiscountRule = async (req, res) => {
  try {
    const { discountRuleId, productId } = req.params;
    const discountRule = await removeProductFromDiscountRule(discountRuleId, productId);
    res.json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const addSalesChannelToDiscountRule = async (req, res) => {
  try {
    const { salesChannelId } = req.body;
    const discountRule = await addSalesChannelToDiscountRule(req.params.id, salesChannelId);
    res.json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const removeSalesChannelFromDiscountRule = async (req, res) => {
  try {
    const { discountRuleId, salesChannelId } = req.params;
    const discountRule = await removeSalesChannelFromDiscountRule(discountRuleId, salesChannelId);
    res.json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
