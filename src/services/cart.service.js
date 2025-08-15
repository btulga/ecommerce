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

  addOrUpdateItem: async ({cartId, variantId, quantity, metadata = {}}) => {
    try {
      const cart = await CartService.getCart(cartId);
      if (!cart) {
        throw new Error("Cart not found.");
      }
      const variant = await db.ProductVariant.findByPk(variantId, {
        include: [{
          model: db.Product,
          as: 'product'
        }]
      });
      if (!variant) {
        throw new Error("Product variant not found.");
      }

      //const requiresShipping = variant.product && variant.product.is_deliverable;
      let cartItem = await db.CartItem.findOne({
        where: {
          cart_id: cartId,
          variant_id: variantId
        }
      });

      if (cartItem) {
        // Update existing item
        cartItem.metadata = metadata;
        // Calculate discount for updated quantity
        const priceDetails = await variant.product.getPriceForCustomer(cart.customer_id);
        cartItem.unit_price = priceDetails.price; // This might need adjustment based on how getPriceForCustomer returns price
        cartItem.discount_total = (variant.price - priceDetails.price) * (cartItem.quantity + quantity);

        cartItem.quantity += quantity;

        await cartItem.save();
      } else {
        cartItem = await db.CartItem.create({
          cart_id: cartId,
          variant_id: variantId,
          sku: variant.sku,
          quantity: quantity,
          metadata: metadata,
        });

        // Calculate initial discount for the new item. Pass quantity to getPriceForCustomer
        const priceDetails = await variant.product.getPriceForCustomer(cart.customer_id);
        cartItem.unit_price = priceDetails.price; // Store the discounted price
        cartItem.discount_total = (variant.price - priceDetails.price) * quantity;

        await cartItem.save();
      }

      // Recalculate cart totals
      const updatedCart = await CartService.getCart(cartId); // Fetch updated cart with new item
      updatedCart.subtotal = updatedCart.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      updatedCart.discount_total = updatedCart.items.reduce((sum, item) => sum + item.discount_total, 0);
      // Placeholder for shipping - assumes 0 for now
      updatedCart.shipping_total = 0;
      // Placeholder for tax - assumes 0 for now
      updatedCart.tax_total = 0;

      updatedCart.grand_total = updatedCart.subtotal - updatedCart.discount_total + updatedCart.shipping_total + updatedCart.tax_total;
      await updatedCart.save();

      return updatedCart;

    } catch (error) {
      console.error("Error adding/updating cart item:", error);
      throw new Error("Could not add or update cart item.");
    }
  },
  
  removeItem: async ({cartId, itemId}) => {
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

      // Recalculate cart totals after removing item
      const updatedCart = await CartService.getCart(cartId); // Fetch updated cart
      updatedCart.subtotal = updatedCart.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      updatedCart.discount_total = updatedCart.items.reduce((sum, item) => sum + item.discount_total, 0);
      updatedCart.shipping_total = 0; // Placeholder
      updatedCart.tax_total = 0; // Placeholder
      updatedCart.grand_total = updatedCart.subtotal - updatedCart.discount_total + updatedCart.shipping_total + updatedCart.tax_total;
      await updatedCart.save();

      return updatedCart;
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw new Error("Could not remove cart item.");
    }
  },

  // Applies a coupon to the cart. If a coupon already exists, it will be replaced.
  applyCoupon: async (cartId, couponCode) => {
    try {
      const cart = await CartService.getCart(cartId);
      if (!cart) {
        throw new Error("Cart not found.");
      }

      // If a coupon is already applied, remove the association first
      if (cart.coupon_id) {
        cart.coupon_id = null;
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

  // Function to recalculate cart totals. Can be called after applying/removing coupons or updating items.
  recalculateTotals: async (cartId) => {
    try {
      const cart = await CartService.getCart(cartId);
      if (!cart) {
        throw new Error("Cart not found.");
      }

      cart.subtotal = cart.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      cart.discount_total = cart.items.reduce((sum, item) => sum + item.discount_total, 0);
      cart.shipping_total = 0; // Placeholder
      cart.tax_total = 0; // Placeholder

      // TODO: Apply cart-level discounts/coupons to calculate final discount_total
      // If a coupon is applied to the cart, calculate its effect on the total
      if (cart.coupon) {
          // This is where you would apply the coupon's discount rule to the cart totals.
          // The exact logic depends on your discount rule types (e.g., percentage, fixed amount).
          // For simplicity, let's assume the item discounts are already reflected in item.discount_total
          // and the coupon might provide an additional discount.
          // This part needs to be implemented based on your specific discount rule structure.
          // For now, we'll just use the item discounts.
      }

      cart.grand_total = cart.subtotal - cart.discount_total + cart.shipping_total + cart.tax_total;
      await cart.save();
      return cart;

    } catch (error) {
      console.error("Error recalculating cart totals:", error);
      throw new Error("Could not recalculate cart totals.");
    }
  },

  /**
   * Completes a cart, converting it into an order and initiating payment.
   * @param {string} cartId The ID of the cart to complete.
   * @returns {Promise<object>} The newly created order object.
   */
  completeCart: async ({cartId}) => {
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

      // Call OrderService to create the order and handle fulfillment/payment, passing the selected provider
      const { order, payment } = await OrderService.createOrderFromCart({cart, transaction: t});

      // 4. Mark cart as completed/archived (optional, depending on flow)
      // Mark the cart as completed and associate it with the created order
      cart.status = 'completed'; 
      cart.order_id = order.id; // Associate the cart with the new order
      await cart.save({ transaction: t });


      await t.commit(); // Commit the transaction managed by completeCart
      return { order, payment }; // Return the newly created order

    } catch (error) {
      await t.rollback();
      console.error("Error completing cart:", error);
      throw error;
    }
  }
};

module.exports = CartService;