const {
 createDiscountRule: createDiscountRuleService,
 getDiscountRule: getDiscountRuleService,
 updateDiscountRule: updateDiscountRuleService,
 deleteDiscountRule: deleteDiscountRuleService,
 addProductToDiscountRule: addProductToDiscountRuleService,
 removeProductFromDiscountRule: removeProductFromDiscountRuleService,
 addSalesChannelToDiscountRule: addSalesChannelToDiscountRuleService,
 removeSalesChannelFromDiscountRule: removeSalesChannelFromDiscountRuleService,
} = require('../services/discount-rule.service');

const createDiscountRule = async (req, res) => {
  try {
    const discountRule = await createDiscountRuleService(req.body);
    res.status(201).json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDiscountRule = async (req, res) => {
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

const updateDiscountRule = async (req, res) => {
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

const deleteDiscountRule = async (req, res) => {
  try {
    const deletedDiscountRule = await deleteDiscountRuleService(req.params.id);
    if (deletedDiscountRule) {
      res.json({ message: 'Discount rule deleted successfully' });
    } else {
      res.status(404).json({ message: 'Discount rule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProductToDiscountRule = async (req, res) => {
  try {
    const { productId } = req.body;
    const discountRule = await addProductToDiscountRuleService(req.params.id, productId);
    res.json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeProductFromDiscountRule = async (req, res) => {
  try {
    const { discountRuleId, productId } = req.params;
    const success = await removeProductFromDiscountRuleService(discountRuleId, productId);
    if (success) {
      res.json({ message: 'Product removed from discount rule' });
    } else {
      res.status(404).json({ message: 'Discount rule or product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSalesChannelToDiscountRule = async (req, res) => {
  try {
    const { salesChannelId } = req.body;
    const discountRule = await addSalesChannelToDiscountRule(req.params.id, salesChannelId);
    res.json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSalesChannelFromDiscountRule = async (req, res) => {
  try {
    const { discountRuleId, salesChannelId } = req.params;
    const discountRule = await removeSalesChannelFromDiscountRule(discountRuleId, salesChannelId);
    res.json(discountRule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
