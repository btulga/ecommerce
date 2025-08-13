const PaymentService = require('../services/payment.service');

const PaymentController = {
  /**
   * Handles webhook notifications from payment providers.
   * This is a critical endpoint that needs to be secured.
   */
  handleWebhook: async (req, res) => {
    try {
      const providerId = req.params.providerId; // e.g., 'stripe'
      const event = req.body; // The event object from the provider

      // 1. Verify the webhook signature (CRITICAL for security)
      // e.g., const verifiedEvent = StripeService.constructEvent(req.body, req.headers['stripe-signature']);
      
      // 2. Process the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const orderId = event.data.object.metadata.order_id;
          const providerData = { transaction_id: event.data.object.id };
          
          console.log(`Webhook received: Capturing payment for order ${orderId}`);
          await PaymentService.capturePayment(orderId, providerId, providerData);
          break;
        // Handle other events like 'payment_intent.payment_failed'
        case 'payment_intent.payment_failed':
            console.log(`Webhook received: Payment failed for order ${event.data.object.metadata.order_id}`);
            // TODO: Update order status to 'payment_failed'
            break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      
      // Respond to the webhook provider to acknowledge receipt
      res.status(200).json({ received: true });

    } catch (error) {
      console.error(`Webhook error for provider ${req.params.providerId}:`, error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  },

  /**
   * Initiates a payment with the selected payment provider.
   */
  initiatePayment: async (req, res) => {
    try {
      const { cartId, paymentProviderId } = req.body;

      if (!cartId || !paymentProviderId) {
        return res.status(400).json({ message: 'Missing required parameters: cartId or paymentProviderId' });
      }

      // TODO: Fetch the cart object based on cartId
      const paymentDetails = await PaymentService.initiateProviderPayment({ cartId, paymentProviderId });
      res.status(200).json(paymentDetails);
    } catch (error) {
      console.error('Error initiating payment:', error);
      res.status(500).json({ message: 'Failed to initiate payment', error: error.message });
    }
  }
};

module.exports = PaymentController;
