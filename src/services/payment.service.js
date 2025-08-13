const {
  Payment,
  Order,
  Cart,
  Coupon,
  SalesChannelPaymentProvider,
  sequelize,
} = require('../models');
const QpayService = require('../provider/payment/qpay.service'); // Assuming this path is correct based on project file list
const { v4: uuidv4 } = require('uuid');

/**
 * Map of supported payment provider services.
 */
const paymentProviders = {  
  qpay: QpayService,
}

const PaymentService = {
  /**
   * Creates a payment record based on an order.
   * @param {object} order - The order object for which to create a payment.
   * @param {object} order - The newly created order object.
   * @param {object} transaction - The Sequelize transaction object.
   * @returns {Promise<object>} The created payment record.
   */
  createPayment: async ({ order, transaction, providerId = null }) => {
    // 1. Calculate the final amount from the cart
    // const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
  
    // let total = subtotal;
    // // Apply discount if a coupon exists
    // if (cart.coupon && cart.coupon.rule) {
    //     const rule = cart.coupon.rule;
    //     if (rule.type === 'percentage') {
    //         total -= total * (rule.value / 100);
    //     } else if (rule.type === 'fixed') {
    //         total -= rule.value;
    //     }
    // }
    // Add taxes, shipping, etc. (future implementation)
    
    // 2. Create the payment record
    // Associate the payment with the order
    const payment = await Payment.create({
      id: 
      order_id: order.id,
      amount: order.total, // Use the total calculated on the order
      currency_code: order.currency_code,
      provider_id: providerId, // Can be set during creation or updated later
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
      // Assuming cart_id is available on the order or can be retrieved
      const cart = await Cart.findByPk(order.cart_id, { transaction: t }); // Retrieve cart to check for coupon
      if (cart && cart.coupon_id) { 
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
   * Initiates a payment session with a provider using cart details.
   * @param {object} cart - The cart object for which to initiate the payment.
   * @param {string} paymentProviderId The ID of the payment provider selected by the user/system.
   * @returns {Promise<object>} Data from the payment provider needed to complete the payment (e.g., redirect URL, QR code data).
   */
  initiateProviderPayment: async ({ cartId, paymentProviderId }) => {
    const t = await sequelize.transaction(); 
    try {
      const cart = await Cart.findByPk(cartId); // Assuming cart model is accessible
      if (!cart) {
        throw new Error('Cart not found');
      }

      // find order
      const order = await Order.findOne({
        where: {
          cart_id: cartId
        }
      });
      if (!order) {
        throw new Error('Order not found');
      }
      // validate accepted payment is exist
      const payments = await Payment.findAll({
        where: {
          order_id: order.id,
          status: ['paid', 'captured']
        }
      });
      if (payments.length > 0) {
        throw new Error('Order already paid, u cant change payment provider');
      }

      // In a real application, you would determine the sales channel from the cart or user context
      // For now, we'll assume a default sales channel or fetch it from the cart if available.
      const salesChannelId = cart.sales_channel_id; // Assuming sales_channel_id is on the cart

      const availableProviders = await PaymentService.getAvailablePaymentProvidersForSalesChannel(salesChannelId);
      const isProviderAvailable = availableProviders.some(provider => provider.code === paymentProviderId);

      if (!isProviderAvailable) {
        throw new Error(`Payment provider "${paymentProviderId}" is not available for sales channel "${salesChannelId}".`);
      }
      // cancel old payment if exists
      await Payment.update({
          status: 'cancelled'
        },{
          where: {
            order_id: order.id,
            status: 'pending',
          },
          transaction: t
      });
     
      // 2. Get the corresponding payment provider service
      const providerService = paymentProviders[paymentProviderId];

      if (!providerService || typeof providerService.createInvoice !== 'function') { // Assuming a createInvoice method exists on provider services
        throw new Error(`Invalid or unsupported payment provider service for "${paymentProviderId}".`);
      }

      // 3. Call the provider's method to initiate the payment
      const paymentId = uuidv4();

      // The method name might vary, using createInvoice as an example
      const providerResponse = await providerService.createInvoice({ orderId: order.id, amount: order.amount, paymentId }); // Assuming order_id is used by the provider
      // Store provider-specific data if needed
      // This might be done later when capturing the payment or associating with a payment record.
       // create new payment
      await Payment.create({
        id: paymentId,
        order_id: order.id,
        amount: order.total, // Use the total calculated on the order
        currency_code: order.currency_code,
        provider_id: providerId, // Can be set during creation or updated later
        status: 'pending', // Awaiting action from a payment provider,
        data: { [paymentProviderId]: providerResponse }
      }, { transaction });

      await t.commit();
      return providerResponse; // Return data needed for frontend
    } catch (error) {
      await t.rollback();
      console.error("Error capturing payment:", error);
      throw error;
    }
  },
};

module.exports = PaymentService;
