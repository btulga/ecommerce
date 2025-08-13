const CartService = require('../services/cart.service');

const CartController = {
  createCart: async (req, res) => {
    try {
      const { customer_id, sales_channel_id } = req.body;
      const cart = await CartService.createCart(customer_id, sales_channel_id);
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCart: async (req, res) => {
    try {
      const { id } = req.params;
      const cart = await CartService.getCart(id);
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  addOrUpdateItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { variant_id, quantity } = req.body;
      const updatedCart = await CartService.addOrUpdateItem(id, variant_id, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeItem: async (req, res) => {
    try {
      const { cartId, itemId } = req.params;
      const updatedCart = await CartService.removeItem(cartId, itemId);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  applyCoupon: async (req, res) => {
    try {
      const { id } = req.params;
      const { coupon_code } = req.body;
      const updatedCart = await CartService.applyCoupon(id, coupon_code);
      res.status(200).json(updatedCart);
    } catch (error) {
      if (error.message.includes("your account")) {
        res.status(400).json({ message: error.message, code: 'coupon_not_applicable_to_user' });
      } else if (error.message.includes("logged in")) {
        res.status(401).json({ message: error.message, code: 'authentication_required' });
      } else if (error.message.includes("coupon")) {
        res.status(400).json({ message: error.message, code: 'invalid_coupon' });
      } else if (error.message.includes("sales channel")) {
        res.status(400).json({ message: error.message, code: 'invalid_sales_channel' });
      } else if (error.message.includes("products")) {
        res.status(400).json({ message: error.message, code: 'coupon_not_applicable_to_products' });
      }
      else {
        res.status(500).json({ message: error.message });
      }
    }
  },

  /**
   * Completes a cart and creates an order.
   * POST /carts/:id/complete
   */
  completeCart: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await CartService.completeCart({ cartId: id });
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = CartController;
