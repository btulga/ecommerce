const {
  Payment,
  Order,
  Cart,
  Coupon,
  SalesChannelPaymentProvider,
  sequelize,
} = require('../models');
const QpayService = require('../provider/payment/qpay.service'); // Assuming this path is correct based on project file list

/**
 * Map of supported payment provider services.
 */
const paymentProviders = {
  qpay: QpayService,
}

const PaymentService = {
  /**
   * Creates a payment record based on a cart.
   * This is called internally when an order is created from a cart.
   * @param {object} cart - The fully loaded cart object.
   * @param {object} order - The newly created order object.
   * @param {object} transaction - The Sequelize transaction object.
   * @returns {Promise<object>} The created payment record.
   */
  createPayment: async ({cart, order, transaction, providerId}) => {
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
    const payment = await Payment.create({
      order_id: order.id,
      amount: Math.round(total), // Store amount in smallest currency unit (e.g., cents)
      currency_code: order.currency_code,
      provider_id:  providerId, // Default provider, can be updated later
      status: 'awaiting', // Awaiting action from a payment provider
    }, { transaction });

    return payment;
  },

  /**
   * Retrieves available payment providers for a given sales channel.
   * @param {string} salesChannelId - The ID of the sales channel.
   * @returns {Promise<Array<{ code: string, name: string }>>} Array of available payment providers.
   */
  getAvailablePaymentProvidersForSalesChannel: async (salesChannelId) => {
    const salesChannelLinks = await SalesChannelPaymentProvider.findAll({
      where: {
        sales_channel_id: salesChannelId
      },
      attributes: ['payment_provider_id'],
    });

    const providerIds = salesChannelLinks.map(link => link.payment_provider_id);

    // Return information about the available providers based on their IDs
    return Object.keys(paymentProviders)
      .filter(providerKey => providerIds.includes(providerKey))
      .map(providerKey => ({
        code: providerKey,
        name: providerKey.toUpperCase(), // Or a more user-friendly name
      }));
  },

  /**
   * Initiates a payment session with a provider (e.g., Stripe).
   * @param {string} cartId 
   * @returns {Promise<object>} Data from the payment provider (e.g., a client_secret from Stripe).
   */
  createPaymentSession: async (cartId) => {
    // This function might need refactoring depending on how you initiate sessions with specific providers
    // and how sales channel is determined here.
    const cart = await Cart.findByPk(cartId); // Assuming cart model is accessible
    if (!cart) {
      throw new Error('Cart not found');
    }
    // Logic to choose payment provider
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
    const t = await sequelize.transaction();
    try {
      const payment = await Payment.findOne({
        where: {
          order_id: orderId
        }}, { transaction: t });
      if (!payment) {
        throw new Error(`Payment record not found for order ID: ${orderId}.`);
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
      const order = await Order.findByPk(orderId, { transaction: t });
      if (!order) {
        throw new Error(`Order not found with ID: ${orderId}.`);
      }
      order.payment_status = 'captured';
      await order.save({ transaction: t });
      
      // Increment coupon usage if one was used
      if (order.cart_id) { // Assuming order has cart_id
          await db.Coupon.increment('usage_count', { where: { id: cart.coupon_id }, transaction: t });
      }

      await t.commit();
      return payment;
    } catch (error) {
      await t.rollback();
      console.error("Error capturing payment:", error);
      throw error;
    }
  },

  /**
   * Initiates a payment with a specific provider for a given payment record.
   * This function is modified to be called with salesChannelId and selectedPaymentProviderId.
   * @param {string} paymentId The ID of the payment record.
   * @param {string} salesChannelId The ID of the sales channel.
   * @param {string} paymentProviderId The ID of the payment provider selected by the user/system.
   * @returns {Promise<object>} Data from the payment provider needed to complete the payment (e.g., redirect URL, QR code data).
   */
  initiateProviderPayment: async (paymentId, salesChannelId, paymentProviderId) => {
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      throw new Error('Payment record not found.');
    }

    // 1. Check if the selected provider is available for this sales channel
    const availableProviders = await PaymentService.getAvailablePaymentProvidersForSalesChannel(salesChannelId);
    const isProviderAvailable = availableProviders.some(provider => provider.code === paymentProviderId);

    if (!isProviderAvailable) {
      throw new Error(`Payment provider "${paymentProviderId}" is not available for sales channel "${salesChannelId}".`);
    }

    // 2. Get the corresponding payment provider service
    const providerService = paymentProviders[paymentProviderId];

    if (!providerService || typeof providerService.createInvoice !== 'function') { // Assuming a createInvoice method exists on provider services
      throw new Error(`Invalid or unsupported payment provider service for "${paymentProviderId}".`);
    }

    // 3. Call the provider's method to initiate the payment
    // The method name might vary, using createInvoice as an example
    const providerResponse = await providerService.createInvoice(payment.order_id, payment.amount, payment.currency_code);
    // Store provider-specific data if needed
    payment.data = { ...payment.data, [paymentProviderId]: provPaymentServiceiderResponse }; // Store response under provider key
    await payment.save();
    return providerResponse; // Return data needed for frontend
  },
};

module.exports = PaymentService;
