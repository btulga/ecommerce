const { DiscountRule, Product, SalesChannel, DiscountRuleProduct, DiscountRuleSalesChannel } = require('../models');

/**
 * Creates a new discount rule.
 * @param {object} data - The discount rule data.
 * @returns {Promise<object>} The created discount rule.
 */
const createDiscountRule = async (data) => {
  return await DiscountRule.create(data);
};

/**
 * Retrieves a discount rule by its ID.
 * @param {string} id - The ID of the discount rule.
 * @returns {Promise<object|null>} The discount rule or null if not found.
 */
const getDiscountRuleById = async (id) => {
  return await DiscountRule.findByPk(id, {
    include: [
      { model: Product, through: DiscountRuleProduct },
      { model: SalesChannel, through: DiscountRuleSalesChannel }
    ]
  });
};

/**
 * Updates a discount rule.
 * @param {string} id - The ID of the discount rule.
 * @param {object} data - The update data.
 * @returns {Promise<[number, object[]]>} The number of affected rows and the updated discount rules.
 */
const updateDiscountRule = async (id, data) => {
  return await DiscountRule.update(data, {
    where: { id },
    returning: true,
  });
};

/**
 * Deletes a discount rule.
 * @param {string} id - The ID of the discount rule.
 * @returns {Promise<number>} The number of deleted rows.
 */
const deleteDiscountRule = async (id) => {
  return await DiscountRule.destroy({
    where: { id },
  });
};

/**
 * Adds products to a discount rule.
 * @param {string} discountRuleId - The ID of the discount rule.
 * @param {string[]} productIds - An array of product IDs to add.
 * @returns {Promise<void>}
 */
const addProductsToDiscountRule = async (discountRuleId, productIds) => {
  const discountRule = await DiscountRule.findByPk(discountRuleId);
  if (!discountRule) {
    throw new Error('Discount rule not found.');
  }
  const products = await Product.findAll({ where: { id: productIds } });
  await discountRule.addProducts(products);
};

/**
 * Removes products from a discount rule.
 * @param {string} discountRuleId - The ID of the discount rule.
 * @param {string[]} productIds - An array of product IDs to remove.
 * @returns {Promise<void>}
 */
const removeProductsFromDiscountRule = async (discountRuleId, productIds) => {
  const discountRule = await DiscountRule.findByPk(discountRuleId);
  if (!discountRule) {
    throw new Error('Discount rule not found.');
  }
  const products = await Product.findAll({ where: { id: productIds } });
  await discountRule.removeProducts(products);
};

/**
 * Adds sales channels to a discount rule.
 * @param {string} discountRuleId - The ID of the discount rule.
 * @param {string[]} salesChannelIds - An array of sales channel IDs to add.
 * @returns {Promise<void>}
 */
const addSalesChannelsToDiscountRule = async (discountRuleId, salesChannelIds) => {
  const discountRule = await DiscountRule.findByPk(discountRuleId);
  if (!discountRule) {
    throw new Error('Discount rule not found.');
  }
  const salesChannels = await SalesChannel.findAll({ where: { id: salesChannelIds } });
  await discountRule.addSalesChannels(salesChannels);
};

/**
 * Removes sales channels from a discount rule.
 * @param {string} discountRuleId - The ID of the discount rule.
 * @param {string[]} salesChannelIds - An array of sales channel IDs to remove.
 * @returns {Promise<void>}
 */
const removeSalesChannelsFromDiscountRule = async (discountRuleId, salesChannelIds) => {
  const discountRule = await DiscountRule.findByPk(discountRuleId);
  if (!discountRule) {
    throw new Error('Discount rule not found.');
  }
  const salesChannels = await SalesChannel.findAll({ where: { id: salesChannelIds } });
  await discountRule.removeSalesChannels(salesChannels);
};

/**
 * Validates a coupon application against a discount rule.
 * @param {string} discountRuleId - The ID of the discount rule.
 * @param {string} salesChannelId - The ID of the sales channel.
 * @param {string[]} productIds - An array of product IDs in the cart.
 * @returns {Promise<boolean>} True if the coupon is valid, false otherwise.
 */
const validateCouponApplication = async (discountRuleId, salesChannelId, productIds) => {
  const discountRule = await getDiscountRuleById(discountRuleId);

  if (!discountRule) {
    return false; // Discount rule does not exist
  }

  // Check if the discount rule is valid for the sales channel
  if (discountRule.SalesChannels && discountRule.SalesChannels.length > 0) {
    const validForSalesChannel = discountRule.SalesChannels.some(
      (channel) => channel.id === salesChannelId
    );
    if (!validForSalesChannel) {
      return false;
    }
  }

  // Check if the discount rule applies to any of the products in the cart
  if (discountRule.Products && discountRule.Products.length > 0) {
    const appliesToProducts = discountRule.Products.some(
      (product) => productIds.includes(product.id)
    );
    if (!appliesToProducts) {
      return false;
    }
  }

  // Add other validation logic here (e.g., usage limits, expiry date)

  return true;
};


module.exports = {
  createDiscountRule,
  getDiscountRuleById,
  updateDiscountRule,
  deleteDiscountRule,
  addProductsToDiscountRule,
  removeProductsFromDiscountRule,
  addSalesChannelsToDiscountRule,
  removeSalesChannelsFromDiscountRule,
  validateCouponApplication,
};