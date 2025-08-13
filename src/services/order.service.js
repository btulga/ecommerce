const db = require('../models');
const PaymentService = require('./payment.service'); // Assuming you have a PaymentService
const TelcoService = require('./telco.service'); // Assuming you will create a TelcoService

const OrderService = {
  /**
   * Creates an order from a given cart.
    *
    * This function takes a cart object and initiates the process of creating an order
    * based on its contents. It performs validation checks on the cart, creates the
    * main order record, converts cart items into order items, and initiates the
    * payment process using a separate PaymentService. It operates within a database
    * transaction to ensure atomicity.
    * @param {object} cart The cart object to convert to an order.
   * @returns {Promise<object>} The newly created order object.
   */
  createOrderFromCart: async ({ cart, paymentProviderId, transaction }) => {
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
        order_amount: cart.total, // Assuming cart total is available
        status: 'pending', // Initial status
        payment_status: 'awaiting',
        fulfillment_status: 'not_fulfilled',
        // Conditionally include shipping addresses if deliverable products exist
        shipping_address_id: cart.shipping_address_id ? cart.shipping_address_id : null,
      }, { transaction });

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
        }, { transaction });
      }));

      // 3. Create Payment record (Assuming PaymentService handles payment initiation)
      // You might need to pass order details and potentially shipping info to createPayment
      await PaymentService.createPayment({
        order, // Pass the order
        transaction,
        providerId: paymentProviderId,
      });

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

  /**
     * Processes the fulfillment of an order after payment is confirmed.
     * @param {string} orderId The ID of the order to fulfill.
     * @returns {Promise<void>}
     */
  processOrderFulfillment: async (orderId) => {
    const t = await db.sequelize.transaction();
    try {
      const order = await db.Order.findByPk(orderId, {
        include: [{
          model: db.OrderItem,
          as: 'items',
          include: [{
            model: db.ProductVariant,
            as: 'variant',
            include: [{
              model: db.Product,
              as: 'product'
            }]
          }]
        }]
      });

      if (!order) {
        console.error(`Order with ID ${orderId} not found for fulfillment.`);
        await t.rollback();
        return;
      }

      // **Crucially, check if the order is paid**
      if (order.payment_status !== 'paid') {
        console.warn(`Order ${orderId} is not paid. Skipping fulfillment.`);
        await t.rollback();
        return;
      }

      let allItemsFulfilled = true;

      await Promise.all(order.items.map(async (orderItem) => {
        const product = orderItem.variant && orderItem.variant.product;
        if (!product) {
          console.warn(`Product not found for order item ${orderItem.id}. Cannot fulfill.`);
          allItemsFulfilled = false; // Cannot fulfill if product is missing
          return;
        }

        if (product.type === 'physical') {
          // Decrease inventory for physical products (moved from createOrderFromCart)
          if (orderItem.fulfillment_status !== 'fulfilled') { // Avoid double fulfillment on retries
            try {
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
                orderItem.fulfillment_status = 'fulfilled';
                await orderItem.save({ transaction: t });
                console.log(`Physical product ${orderItem.id} inventory decreased and marked as fulfilled.`);
              } else {
                console.warn(`Inventory not found for physical product ${orderItem.id} at location ${orderItem.location_id}.`);
                allItemsFulfilled = false; // Cannot fulfill if inventory is missing
                orderItem.fulfillment_status = 'fulfillment_failed';
                await orderItem.save({ transaction: t });
              }
            } catch (inventoryError) {
              console.error(`Error decreasing inventory for physical product ${orderItem.id}:`, inventoryError);
              allItemsFulfilled = false; // Fulfillment failed for this item
              orderItem.fulfillment_status = 'fulfillment_failed';
              await orderItem.save({ transaction: t });
            }
          }

        } else if (product.type === 'digital') {
          if (orderItem.activation_status === 'pending') {
            try {
              // Call TelcoService to activate number
              // You'll need to implement TelcoService.activateNumber
              // and pass the necessary parameters (e.g., selected_number, activation_code)
              // await TelcoService.activateNumber(orderItem.selected_number, orderItem.activation_code, { transaction: t });

              orderItem.activation_status = 'activated';
              orderItem.fulfillment_status = 'fulfilled'; // Digital fulfillment is activation
              await orderItem.save({ transaction: t });
              console.log(`Digital product ${orderItem.id} activated.`);
            } catch (telcoError) {
              console.error(`Error activating number for order item ${orderItem.id}:`, telcoError);
              orderItem.activation_status = 'activation_failed';
              orderItem.fulfillment_status = 'fulfillment_failed';
              await orderItem.save({ transaction: t });
              allItemsFulfilled = false; // Fulfillment failed for this item
              // Decide how to handle activation failures (e.g., send notification, retry)
            }
          } else {
            // If status is not 'pending', assume already handled or 'activate_later'
            orderItem.fulfillment_status = 'fulfilled'; // Or another status if 'activate_later'
            await orderItem.save({ transaction: t });
          }
        } else if (product.type === 'service') {
          // Handle service product fulfillment (top-up, data, etc.)
          // This logic will depend on the specific service product (e.g., using product.handle)
          // Check if the service item is already fulfilled to avoid double fulfillment
          if (orderItem.fulfillment_status !== 'fulfilled') {
            try {
              // You'll need to implement appropriate TelcoService functions
              // based on the specific service product.
              // Example for top-up:
              // if (product.handle === 'unit-top-up') {
              //   await TelcoService.topUp(orderItem.target_phone_number, orderItem.quantity, { transaction: t });
              // } else if (product.handle === 'data-add-on') {
              //   await TelcoService.addData(orderItem.target_phone_number, orderItem.quantity, { transaction: t });
              // }
              // Add logic for eSIM reactivation, subscriptions, etc.

              // If service call is successful
              orderItem.fulfillment_status = 'fulfilled';
              await orderItem.save({ transaction: t });
              console.log(`Service product ${orderItem.id} fulfilled.`);

            } catch (telcoError) {
              console.error(`Error fulfilling service for order item ${orderItem.id}:`, telcoError);
              orderItem.fulfillment_status = 'fulfillment_failed';
              await orderItem.save({ transaction: t });
              allItemsFulfilled = false; // Fulfillment failed for this item
              // Decide how to handle service fulfillment failures
            }
          }
        }
      }));

      // Update order fulfillment status
      if (allItemsFulfilled) {
        order.fulfillment_status = 'fulfilled';
        await order.save({ transaction: t });
        console.log(`Order ${orderId} fulfillment completed.`);
      } else {
        order.fulfillment_status = 'partially_fulfilled'; // Or 'fulfillment_failed' if no items were fulfilled
        await order.save({ transaction: t });
        console.warn(`Order ${orderId} fulfillment is partial or failed.`);
      }


      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error(`Error processing fulfillment for order ${orderId}:`, error);
      // Potentially update order status to indicate fulfillment failure
    }
  },
};

module.exports = OrderService;