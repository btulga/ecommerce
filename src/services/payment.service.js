const db = require('../models');
const CartService = require('./cart.service');
// In a real application, you would have a service for each payment provider
// const StripeService = require('./stripe.service'); 

const PaymentService = {

  /**
   * Creates a payment record based on a cart.
   * This is called internally when an order is created from a cart.
   * @param {object} cart - The fully loaded cart object.
   * @param {object} order - The newly created order object.
   * @param {object} transaction - The Sequelize transaction object.
   * @returns {Promise<object>} The created payment record.
   */
  createPayment: async (cart, order, transaction) => {
    // 1. Calculate the final amount from the cart
    const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
    
    let total = subtotal;
    // Apply discount if a coupon exists
    if (cart.coupon && cart.coupon.rule) {
        const rule = cart.coupon.rule;
        if (rule.type === 'percentage') {
            total -= total * (rule.value / 100);
        } else if (rule.type === 'fixed') {
            total -= rule.value;
        }
    }
    // Add taxes, shipping, etc. (future implementation)
    
    // 2. Create the payment record
    const payment = await db.Payment.create({
      order_id: order.id,
      amount: Math.round(total), // Store amount in smallest currency unit (e.g., cents)
      currency_code: order.currency_code,
      provider_id: 'manual', // Default provider, can be updated later
      status: 'awaiting', // Awaiting action from a payment provider
    }, { transaction });

    return payment;
  },

  /**
   * Initiates a payment session with a provider (e.g., Stripe).
   * @param {string} cartId 
   * @returns {Promise<object>} Data from the payment provider (e.g., a client_secret from Stripe).
   */
  createPaymentSession: async (cartId) => {
    const cart = await CartService.getCart(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    // Logic to choose payment provider
    // For now, we simulate creating a session.
    // In a real app:
    // return StripeService.createPaymentIntent(cart.total, cart.currency_code);
    
    console.log(`Initiating payment session for cart ${cartId}`);
    return {
        message: "Payment session initiated. Ready to capture.",
        cartId: cart.id,
        // Mocking a provider's session ID
        provider_session_id: `ps_${new Date().getTime()}` 
    };
  },

  /**
   * Marks a payment as captured. Usually called by a webhook from the payment provider.
   * @param {string} orderId The ID of the order.
   * @param {string} providerId The ID of the payment provider (e.g., 'stripe').
   * @param {object} providerData Data from the provider (e.g., transaction ID).
   * @returns {Promise<object>} The updated payment record.
   */
  capturePayment: async (orderId, providerId, providerData) => {
    const t = await db.sequelize.transaction();
    try {
      const payment = await db.Payment.findOne({ where: { order_id: orderId } }, { transaction: t });
      if (!payment) {
        throw new Error('Payment record not found for this order.');
      }
      if (payment.status === 'captured') {
        // Idempotency: if already captured, just return success.
        return payment; 
      }

      // Update payment status and save provider data
      payment.status = 'captured';
      payment.provider_id = providerId;
      payment.data = providerData; // Store transaction_id, etc.
      await payment.save({ transaction: t });

      // Update order status
      const order = await db.Order.findByPk(orderId, { transaction: t });
      order.payment_status = 'captured';
      await order.save({ transaction: t });
      
      // Increment coupon usage if one was used
      const cart = await db.Cart.findByPk(order.cart_id, { transaction: t });
      if(cart && cart.coupon_id) {
          await db.Coupon.increment('usage_count', { where: { id: cart.coupon_id }, transaction: t });
      }

      await t.commit();
      return payment;
    } catch (error) {
      await t.rollback();
      console.error("Error capturing payment:", error);
      throw error;
    }
  }
};

module.exports = PaymentService;
