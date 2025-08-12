const db = require('../models');
const CouponService = require('./coupon.service');
const OrderService = require('./order.service'); // Import OrderService
const PaymentService = require('./payment.service'); // Import PaymentService

const CartService = {
  createCart: async (customer_id, salesChannelId) => {
    try {
      const cart = await db.Cart.create({
        customer_id: customer_id || null,
        sales_channel_id: salesChannelId,
      });
      return cart;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw new Error("Could not create cart.");
    }
  },

  getCart: async (cartId) => {
    try {
      const cart = await db.Cart.findByPk(cartId, {
        include: [{
          model: db.CartItem,
          as: 'items',
          include: [{
            model: db.ProductVariant,
            as: 'variant',
            include: [{
              model: db.Product,
              as: 'product'
            }]
          }]
        }, {
          model: db.Coupon,
          as: 'coupon', // Assuming Cart has a foreign key to Coupon
          include: [{
            model: db.DiscountRule,
            as: 'rule'
          }]
        }, {
          model: db.Customer, // Include customer to get email, etc.
          as: 'customer'
        }]
      });
      if (!cart) {
        throw new Error("Cart not found.");
      }
      return cart;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw new Error("Could not retrieve cart.");
    }
  },

  addOrUpdateItem: async (cartId, variantId, quantity, locationId = null,
 targetPhoneNumber = null, selectedNumber = null, activationCode = null) => {
    try {
      const cart = await CartService.getCart(cartId);
      const variant = await db.ProductVariant.findByPk(variantId, {
        include: [{
          model: db.Product,
          as: 'product'
        }]
      });

      if (!variant) {
        throw new Error("Product variant not found.");
      }

      // Check inventory at the specified location if a locationId is provided
      if (locationId) {
        const inventory = await db.Inventory.findOne({
          where: {
            variant_id: variantId,
            location_id: locationId,
          },
        });
        if (!inventory || inventory.quantity < quantity) {
          throw new Error("Not enough inventory at this location.");
        }
      }

      const requiresShipping = variant.product && variant.product.is_deliverable;

      let cartItem = await db.CartItem.findOne({
        where: {
          cart_id: cartId,
          variant_id: variantId
        }
      });

      if (cartItem) {
        // Update existing item
        if (variant.product && variant.product.type === 'service' && targetPhoneNumber) {
            cartItem.target_phone_number = targetPhoneNumber;
        } else if (variant.product && variant.product.type === 'digital' && selectedNumber) {
            cartItem.selected_number = selectedNumber;
        }
         if (activationCode) {
             cartItem.activation_code = activationCode;
         }
        if (locationId) {
             cartItem.location_id = locationId;
        }
        cartItem.quantity += quantity;

        await cartItem.save();
      } else {
        cartItem = await db.CartItem.create({
          cart_id: cartId,
          variant_id: variantId,
          target_phone_number: isServiceProduct ? targetPhoneNumber : null, // Save phone number for service products
          location_id: locationId, // Store the selected location
          selected_number: selectedNumber, // Store selected number
          activation_code: activationCode, // Store activation code
          quantity: quantity,
          unit_price: variant.price,
        });
      }
      return await CartService.getCart(cartId);
    } catch (error) {
      console.error("Error adding/updating cart item:", error);
      throw new Error("Could not add or update cart item.");
    }
  },
  
  removeItem: async (cartId, itemId) => {
    try {
      const cartItem = await db.CartItem.findOne({
        where: {
          id: itemId,
          cart_id: cartId
        }
      });

      if (!cartItem) {
        throw new Error("Cart item not found or does not belong to this cart.");
      }

      await cartItem.destroy();
      return await CartService.getCart(cartId);
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw new Error("Could not remove cart item.");
    }
  },
  
  applyCoupon: async (cartId, couponCode) => {
    try {
      const cart = await CartService.getCart(cartId);
      if (!cart) {
        throw new Error("Cart not found.");
      }

      const validatedCoupon = await CouponService.validateCoupon(couponCode, cart);

      cart.coupon_id = validatedCoupon.id;
      await cart.save();
      
      return await CartService.getCart(cartId);
    } catch (error) {
      console.error("Error applying coupon:", error.message || error);
      throw error;
    }
  },

  /**
   * Completes a cart, converting it into an order and initiating payment.
   * @param {string} cartId The ID of the cart to complete.
   * @returns {Promise<object>} The newly created order object.
   */
  completeCart: async (cartId) => {
    const t = await db.sequelize.transaction();
    try {
      const cart = await CartService.getCart(cartId); // Get full cart with all details

      if (!cart) {
        throw new Error("Cart not found.");
      }
      if (!cart.customer_id) {
          throw new Error("A customer must be associated with the cart to complete an order.");
      }
      if (!cart.items || cart.items.length === 0) {
          throw new Error("Cannot complete an empty cart.");
      }
      // TODO: Add more validations here (e.g., shipping address, payment method, inventory check)

      // Check if the cart contains any deliverable products
      const hasDeliverableProducts = cart.items.some(item =>
        item.variant && item.variant.product && item.variant.product.is_deliverable === true
      );

      // TODO: Add more validations here (e.g., payment method, inventory check)
      // If hasDeliverableProducts, ensure shipping address is provided in the cart
      if (hasDeliverableProducts && !cart.shipping_address_id) {
          throw new Error("Shipping address is required for this cart.");
      }

      // Call OrderService to create the order and handle fulfillment/payment
      const order = await OrderService.createOrderFromCart(cart, t);

      // 4. Mark cart as completed/archived (optional, depending on flow)
      // cart.status = 'completed'; 
      // await cart.save({ transaction: t });

      await t.commit(); // Commit the transaction managed by completeCart
      return order; // Return the newly created order

    } catch (error) {
      await t.rollback();
      console.error("Error completing cart:", error);
      throw error;
    }
  }
};

module.exports = CartService;
