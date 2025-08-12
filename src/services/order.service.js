const db = require('../models');
const PaymentService = require('./payment.service'); // Assuming you have a PaymentService
const TelcoService = require('./telco.service'); // Assuming you will create a TelcoService

const OrderService = {
  /**
   * Creates an order from a given cart.
   * @param {object} cart The cart object to convert to an order.
   * @returns {Promise<object>} The newly created order object.
   */
  createOrderFromCart: async (cart) => {
    const t = await db.sequelize.transaction();
    try {
      if (!cart) {
        throw new Error("Cart not found.");
      }
      if (!cart.customer_id) {
          throw new Error("A customer must be associated with the cart to complete an order.");
      }
      if (!cart.items || cart.items.length === 0) {
          throw new Error("Cannot create an order from an empty cart.");
      }


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
        // Conditionally include shipping addresses if deliverable products exist
        shipping_address_id: hasDeliverableProducts ? cart.shipping_address_id : null,
      }, { transaction: t });

      // 2. Create OrderItems from CartItems
      await Promise.all(cart.items.map(async (cartItem) => {
        await db.OrderItem.create({
            order_id: order.id,
            location_id: cartItem.location_id,
            variant_id: cartItem.variant_id,
            quantity: cartItem.quantity,
            unit_price: cartItem.unit_price,
            target_phone_number: cartItem.target_phone_number, // Copy phone number to order item
            selected_number: cartItem.selected_number, // Copy selected number
            activation_code: cartItem.activation_code, // Copy activation code
            activation_status: (cartItem.variant && cartItem.variant.product && cartItem.variant.product.type === 'digital') ? 'pending' : null, // Set initial status for digital products
            // You might add product name, thumbnail etc. from variant/product here
        }, { transaction: t });
      }));

      // 2.1 Process Service and Digital products after OrderItems are created
      await Promise.all(order.items.map(async (orderItem) => {
        const product = orderItem.variant && orderItem.variant.product;
        if (!product) {
          console.warn(`Product not found for order item ${orderItem.id}`);
          return;
        }

        if (product.type === 'physical') {
          // Decrease inventory for physical products
          const inventory = await db.Inventory.findOne({
            where: {
              variant_id: orderItem.variant_id,
              location_id: orderItem.location_id,
            },
            transaction: t
          });

          if (inventory) {
            inventory.quantity -= orderItem.quantity;
            await inventory.save({ transaction: t });
          }
        } else if (product.type === 'digital') {
          // Handle digital product activation
          // Note: Activation logic might need to be triggered by a separate fulfillment process
          // after payment is confirmed, depending on the complexity.
          // This is a basic example of triggering activation immediately after order creation.
          if (orderItem.activation_status === 'activate_now') { // Assuming a way to flag 'activate_now'
             try {
               // You'll need to implement TelcoService.activateNumber
               // and pass the necessary parameters (e.g., selected_number, activation_code)
               // await TelcoService.activateNumber(orderItem.selected_number, orderItem.activation_code, { transaction: t });
               orderItem.activation_status = 'activated';
               await orderItem.save({ transaction: t });
             } catch (telcoError) {
               console.error(`Error activating number for order item ${orderItem.id}:`, telcoError);
               orderItem.activation_status = 'activation_failed';
               await orderItem.save({ transaction: t });
               // Decide how to handle activation failures (e.g., send notification, retry)
             }
          }
        } else if (product.type === 'service') {
          // Handle service product fulfillment (top-up, data, etc.)
          // Similar to digital products, this might be triggered by a separate fulfillment process.
          // This is a basic example of triggering service action immediately after order creation.
           try {
             // You'll need to implement appropriate TelcoService functions
             // based on the specific service product.
             // Example for top-up:
             // if (product.handle === 'unit-top-up') { // Assuming product has a handle
             //   await TelcoService.topUp(orderItem.target_phone_number, orderItem.quantity, { transaction: t });
             // } else if (product.handle === 'data-add-on') {
             //   await TelcoService.addData(orderItem.target_phone_number, orderItem.quantity, { transaction: t });
             // }
             // Update order item status or add fulfillment details if needed
           } catch (telcoError) {
             console.error(`Error fulfilling service for order item ${orderItem.id}:`, telcoError);
             // Decide how to handle service fulfillment failures
           }
        }
      }));

      // 3. Create Payment record (Assuming PaymentService handles payment initiation)
      // You might need to pass order details and potentially shipping info to createPayment
      await PaymentService.createPayment(cart, order, t);


      // 4. Optionally, mark cart as completed/archived after order creation
      // cart.status = 'completed';
      // await cart.save({ transaction: t });

      await t.commit();
      return order; // Return the newly created order

    } catch (error) {
      await t.rollback();
      console.error("Error creating order from cart:", error);
      throw error;
    }
  },

  // Add other order-related functions here (e.g., getOrder, updateOrder, cancelOrder)
};

module.exports = OrderService;