const db = require('../models');
const { Op } = require('sequelize');

const CouponService = {
  /**
   * Creates a new Coupon and its associated DiscountRule.
   * @param {object} data The data for the coupon and rule.
   * e.g., { code: 'SUMMER25', rule: { type: 'percentage', value: 25 }, restrictions: { products: [uuid], sales_channels: [uuid] } }
   * @returns {Promise<object>} The created coupon.
   */
  createCoupon: async (data) => {
    const t = await db.sequelize.transaction();
    try {
      // 1. Create the Discount Rule
      const discountRule = await db.DiscountRule.create(data.rule, { transaction: t });

      // 2. Create the Coupon and associate it with the rule
      const coupon = await db.Coupon.create({
        ...data.coupon,
        discount_rule_id: discountRule.id,
      }, { transaction: t });

      // 3. Set associations for restrictions if they exist
      if (data.restrictions) {
        if (data.restrictions.products) {
          await discountRule.setProducts(data.restrictions.products, { transaction: t });
        }
        if (data.restrictions.sales_channels) {
          await discountRule.setSalesChannels(data.restrictions.sales_channels, { transaction: t });
        }
        if (data.restrictions.customers) {
          await discountRule.setCustomers(data.restrictions.customers, { transaction: t });
        }
      }

      await t.commit();
      return await CouponService.getCouponById(coupon.id); // Return the full object
    } catch (error) {
      await t.rollback();
      console.error("Error creating coupon:", error);
      throw new Error("Could not create coupon.");
    }
  },

  /**
   * Retrieves a full coupon by its ID, including all rules and restrictions.
   * @param {string} couponId 
   * @returns {Promise<object>}
   */
  getCouponById: async(couponId) => {
      return db.Coupon.findByPk(couponId, {
          include: [{
              model: db.DiscountRule,
              as: 'rule',
              include: ['products', 'sales_channels', 'customers'],
          }]
      });
  },

  /**
   * Validates a coupon against a given cart context.
   * @param {string} couponCode The code to validate.
   * @param {object} cart The cart object to validate against.
   * @returns {Promise<object>} The full, validated coupon object.
   */
  validateCoupon: async (couponCode, cart) => {
    const coupon = await db.Coupon.findOne({
      where: { code: couponCode, is_disabled: false },
      include: [{
        model: db.DiscountRule,
        as: 'rule',
        include: ['sales_channels', 'products', 'customers']
      }]
    });

    if (!coupon) {
      throw { message: "Invalid or disabled coupon.", code: 'invalid_coupon' };
    }
    
    // Check usage limits
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        throw { message: "Coupon has reached its usage limit.", code: 'usage_limit_reached' };
    }

    const discountRule = coupon.rule;

    // Customer-specific validation
    if (discountRule.customers && discountRule.customers.length > 0) {
      if (!cart.customer_id) {
        throw { message: "You must be logged in to use this coupon.", code: 'authentication_required' };
      }
      if (!discountRule.customers.some(c => c.id === cart.customer_id)) {
        throw { message: "This coupon is not valid for your account.", code: 'coupon_not_applicable_to_user' };
      }
    }

    // Sales Channel validation
    if (discountRule.sales_channels && discountRule.sales_channels.length > 0) {
      if (!discountRule.sales_channels.some(sc => sc.id === cart.sales_channel_id)) {
        throw { message: "This coupon is not valid for the current sales channel.", code: 'invalid_sales_channel' };
      }
    }

    // Product-specific validation
    if (discountRule.products && discountRule.products.length > 0) {
      const cartProductIds = new Set(cart.items.map(item => item.variant.product_id));
      const hasEligibleProduct = discountRule.products.some(p => cartProductIds.has(p.id));
      if (!hasEligibleProduct) {
        throw { message: "This coupon does not apply to any products in your cart.", code: 'coupon_not_applicable_to_products' };
      }
    }
    
    return coupon;
  },
  
  /**
   * Increments the usage count of a coupon.
   * @param {string} couponId 
   */
  incrementUsage: async(couponId) => {
      return db.Coupon.increment('usage_count', { where: { id: couponId }});
  }
};

module.exports = CouponService;
