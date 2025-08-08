const db = require('../models'); // Assuming you have your models
const TelcoService = require('./telco.service'); // You'll need a service for telco integration
// You might also have a ShippingService

const FulfillmentService = {

  /**
   * Initiates fulfillment for an order.
   * @param {object} order - The order object with loaded order items and associated products.
   * @returns {Promise<void>}
   */
  fulfillOrder: async (order) => {
    for (const orderItem of order.items) {
      const product = orderItem.product; // Assuming orderItem is associated with Product

      if (!product) {
        console.error(`Product not found for order item ${orderItem.id}`);
        continue; // Skip if product is not found
      }

      switch (product.type) {
        case 'physical':
          // Handle fulfillment for physical products (e.g., create a shipping label, update shipping status)
          console.log(`Initiating shipping fulfillment for order item ${orderItem.id} (Product: ${product.title})`);
          // await ShippingService.createShipment(order, orderItem); // Example: Call a shipping service
          orderItem.fulfillment_status = 'shipped'; // Example status update
          await orderItem.save();
          break;

        case 'service': // For top-up cards
          // Handle fulfillment for top-up cards (initiate telco top-up)
          console.log(`Initiating telco top-up for order item ${orderItem.id} (Product: ${product.title})`);
          const phoneNumber = orderItem.target_phone_number;
          if (phoneNumber) {
            try {
              // Call the TelcoService to perform the top-up
              await TelcoService.performTopUp(phoneNumber, product.telco_product_id, orderItem.quantity); // Assuming you have telco-specific data on the product
              orderItem.fulfillment_status = 'fulfilled'; // Mark as fulfilled after successful top-up
              await orderItem.save();
            } catch (error) {
              console.error(`Telco top-up failed for order item ${orderItem.id}:`, error);
              orderItem.fulfillment_status = 'fulfillment_failed'; // Example: Mark as failed
              await orderItem.save();
              // You might want to implement a retry mechanism or notify an administrator
            }
          } else {
            console.error(`Phone number not provided for top-up item ${orderItem.id}`);
            orderItem.fulfillment_status = 'fulfillment_failed'; // Example: Mark as failed
            await orderItem.save();
            // Handle the case where the phone number is missing
          }
          break;

        case 'digital': // For phone numbers
          // Handle fulfillment for digital products (e.g., activate phone number, send digital code)
          console.log(`Initiating digital fulfillment for order item ${orderItem.id} (Product: ${product.title})`);
          // await DigitalProductService.deliverProduct(orderItem); // Example: Call a digital product service
          orderItem.fulfillment_status = 'fulfilled'; // Example status update
          await orderItem.save();
          break;

        default:
          console.warn(`Unknown product type "${product.type}" for order item ${orderItem.id}. No fulfillment action taken.`);
          // You might want to set a status indicating unhandled fulfillment
          break;
      }
    }

    // Update the overall order fulfillment status based on the item statuses
    await this.updateOrderStatus(order);
  },

  /**
   * Updates the overall fulfillment status of an order.
   * @param {object} order - The order object with loaded order items.
   * @returns {Promise<void>}
   */
  updateOrderStatus: async (order) => {
    const allItemsFulfilled = order.items.every(item => item.fulfillment_status === 'fulfilled');
    const anyItemFailed = order.items.some(item => item.fulfillment_status === 'fulfillment_failed');
    const anyItemPending = order.items.some(item => item.fulfillment_status === 'not_fulfilled' || item.fulfillment_status === 'pending'); // Assuming 'pending' is a possible initial status

    if (anyItemFailed) {
      order.fulfillment_status = 'fulfillment_failed';
    } else if (allItemsFulfilled) {
      order.fulfillment_status = 'fulfilled';
    } else if (anyItemPending) {
       order.fulfillment_status = 'partially_fulfilled'; // Or another appropriate status
    } else {
        order.fulfillment_status = 'not_fulfilled';
    }

    await order.save();
  }
};

module.exports = FulfillmentService;