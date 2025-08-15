// src/utils/product.helper.js

/**
 * Calculates the discounted price for a product based on customer, quantity,
 * campaigns, discount rules, and customer-specific discount usage limits.
 *
 * @param {object} product - The product object.
 * @param {object} customer - The customer object.
 * @param {number} quantity - The quantity of the product being purchased.
 * @param {object} models - The Sequelize models object to access other models (e.g., CustomerDiscountUsage).
 * @returns {number} The calculated price for the given quantity, considering discounts.
 */