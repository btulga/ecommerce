const CouponService = require('../services/coupon.service');

const CouponController = {
  createCoupon: async (req, res) => {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      res.status(201).json(coupon);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getCoupon: async (req, res) => {
    try {
      const { id } = req.params;
      const coupon = await CouponService.getCouponById(id);
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      res.status(200).json(coupon);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // This controller is for validating a coupon against a cart
  // A more practical approach might have this logic inside the cart controller
  validateForCart: async (req, res) => {
    try {
        const { coupon_code, cart_id } = req.body;
        // In a real app, you would fetch the cart object first
        const mockCart = { id: cart_id, customer_id: req.user.id, sales_channel_id: req.sales_channel.id, items: [] }; // Example
        const validatedCoupon = await CouponService.validateCoupon(coupon_code, mockCart);
        res.status(200).json({ message: "Coupon is valid.", coupon: validatedCoupon });
    } catch(error) {
        res.status(400).json({ message: error.message, code: error.code || 'validation_error' });
    }
  }
};

module.exports = CouponController;
