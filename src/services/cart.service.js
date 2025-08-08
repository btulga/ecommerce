const db = require('../models');
const CouponService = require('./coupon.service');
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

  addOrUpdateItem: async (cartId, variantId, quantity, targetPhoneNumber = null) => {
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

      const isServiceProduct = variant.product && variant.product.type === 'service';

      let cartItem = await db.CartItem.findOne({
        where: {
          cart_id: cartId,
          variant_id: variantId
        }
      });

      if (cartItem) {
        // If it's a service product and a phone number is provided, update it
        if (isServiceProduct && targetPhoneNumber) {
            cartItem.target_phone_number = targetPhoneNumber;
        } else if (isServiceProduct && !targetPhoneNumber) {
             // Optionally handle the case where a service product is added without a phone number
             // throw new Error("Phone number is required for this product.");
        }
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        cartItem = await db.CartItem.create({
          cart_id: cartId,
          variant_id: variantId,
          target_phone_number: isServiceProduct ? targetPhoneNumber : null, // Save phone number for service products
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
      
      // Check if the cart contains any physical products
      const hasPhysicalProducts = cart.items.some(item =>
        item.variant && item.variant.product && item.variant.product.type === 'physical'
      );

      // TODO: If hasPhysicalProducts, ensure shipping address is provided in the cart
      // 1. Create the Order
      const order = await db.Order.create({
        customer_id: cart.customer_id,
        cart_id: cart.id,
        email: cart.customer ? cart.customer.email : '', // Use customer email if available
        currency_code: 'usd', // Or fetch from a config/region
        tax_rate: 0, // Placeholder
        status: 'pending', // Initial status
        payment_status: 'awaiting',
        fulfillment_status: 'not_fulfilled',
        // Conditionally include shipping addresses if physical products exist
        shipping_address_id: hasPhysicalProducts ? cart.shipping_address_id : null,
      }, { transaction: t });

      // 2. Create OrderItems from CartItems
      await Promise.all(cart.items.map(async (cartItem) => {
        await db.OrderItem.create({
          order_id: order.id,
          variant_id: cartItem.variant_id,
          quantity: cartItem.quantity,
          unit_price: cartItem.unit_price,
          target_phone_number: cartItem.target_phone_number, // Copy phone number to order item
          // You might add product name, thumbnail etc. from variant/product here
        }, { transaction: t });
      }));

      // 3. Create Payment record
      await PaymentService.createPayment(cart, order, t);

      // 4. Mark cart as completed/archived (optional, depending on flow)
      // cart.status = 'completed'; 
      // await cart.save({ transaction: t });
      
      await t.commit();
      return order; // Return the newly created order

    } catch (error) {
      await t.rollback();
      console.error("Error completing cart:", error);
      throw error;
    }
  }
};

module.exports = CartService;
