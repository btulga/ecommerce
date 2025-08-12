const OrderService = require('../../src/services/order.service');
const db = require('../../src/models');

// Mock the database and services
jest.mock('../../src/models', () => ({
  Cart: {
    findByPk: jest.fn(),
  },
  Order: {
    create: jest.fn(),
  },
  OrderItem: {
    create: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
  },
}));

jest.mock('../../src/services/payment.service', () => ({
  createPayment: jest.fn(),
}));

describe('OrderService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('createOrderFromCart', () => {
    it('should create an order with shipping address when cart contains deliverable products', async () => {
      const mockCart = {
        id: 'cart_123',
        customer_id: 'customer_123',
        customer: {
          email: 'test@example.com'
        },
        items: [{
          variant_id: 'variant_1',
          quantity: 2,
          unit_price: 10,
          variant: {
            product: {
              is_deliverable: true
            }
          },
        }, ],
        shipping_address_id: 'address_123',
      };

      db.Cart.findByPk.mockResolvedValue(mockCart);
      db.Order.create.mockResolvedValue({
        id: 'order_123'
      });
      db.OrderItem.create.mockResolvedValue({});

      const order = await OrderService.createOrderFromCart('cart_123');

      expect(db.Cart.findByPk).toHaveBeenCalledWith('cart_123', expect.anything());
      expect(db.Order.create).toHaveBeenCalledWith(expect.objectContaining({
        customer_id: 'customer_123',
        cart_id: 'cart_123',
        email: 'test@example.com',
        shipping_address_id: 'address_123',
      }), expect.anything());
      expect(db.OrderItem.create).toHaveBeenCalledTimes(mockCart.items.length);
      expect(db.sequelize.transaction).toHaveBeenCalled();
      expect(db.sequelize.transaction().commit).toHaveBeenCalled();
    });

    it('should create an order without shipping address when cart contains only non-deliverable products', async () => {
      const mockCart = {
        id: 'cart_456',
        customer_id: 'customer_456',
        customer: {
          email: 'test2@example.com'
        },
        items: [{
          variant_id: 'variant_2',
          quantity: 1,
          unit_price: 50,
          variant: {
            product: {
              is_deliverable: false
            }
          },
        }, ],
        shipping_address_id: null, // No shipping address provided
      };

      db.Cart.findByPk.mockResolvedValue(mockCart);
      db.Order.create.mockResolvedValue({
        id: 'order_456'
      });
      db.OrderItem.create.mockResolvedValue({});

      const order = await OrderService.createOrderFromCart('cart_456');

      expect(db.Cart.findByPk).toHaveBeenCalledWith('cart_456', expect.anything());
      expect(db.Order.create).toHaveBeenCalledWith(expect.objectContaining({
        customer_id: 'customer_456',
        cart_id: 'cart_456',
        email: 'test2@example.com',
        shipping_address_id: null, // Shipping address should be null
      }), expect.anything());
      expect(db.OrderItem.create).toHaveBeenCalledTimes(mockCart.items.length);
      expect(db.sequelize.transaction).toHaveBeenCalled();
      expect(db.sequelize.transaction().commit).toHaveBeenCalled();
    });

    it('should throw an error if cart is not found', async () => {
      db.Cart.findByPk.mockResolvedValue(null);

      await expect(OrderService.createOrderFromCart('nonexistent_cart')).rejects.toThrow(
        'Cart not found.'
      );
      expect(db.sequelize.transaction().rollback).toHaveBeenCalled();
    });

    it('should throw an error if cart has no customer', async () => {
      const mockCart = {
        id: 'cart_789',
        customer_id: null,
        items: [],
      };

      db.Cart.findByPk.mockResolvedValue(mockCart);

      await expect(OrderService.createOrderFromCart('cart_789')).rejects.toThrow(
        'A customer must be associated with the cart to complete an order.'
      );
      expect(db.sequelize.transaction().rollback).toHaveBeenCalled();
    });

    it('should throw an error if cart is empty', async () => {
      const mockCart = {
        id: 'cart_101',
        customer_id: 'customer_101',
        customer: {},
        items: [],
      };

      db.Cart.findByPk.mockResolvedValue(mockCart);

      await expect(OrderService.createOrderFromCart('cart_101')).rejects.toThrow(
        'Cannot complete an empty cart.'
      );
      expect(db.sequelize.transaction().rollback).toHaveBeenCalled();
    });


    it('should throw an error and rollback transaction on failure', async () => {
      const mockCart = {
        id: 'cart_rollback',
        customer_id: 'customer_rollback',
        customer: {
          email: 'rollback@example.com'
        },
        items: [{
          variant_id: 'variant_3',
          quantity: 1,
          unit_price: 100,
          variant: {
            product: {
              is_deliverable: true
            }
          },
        }, ],
        shipping_address_id: 'address_456',
      };

      db.Cart.findByPk.mockResolvedValue(mockCart);
      const createOrderError = new Error('Failed to create order');
      db.Order.create.mockRejectedValue(createOrderError);

      await expect(OrderService.createOrderFromCart('cart_rollback')).rejects.toThrow(
        'Failed to create order'
      );
      expect(db.sequelize.transaction().rollback).toHaveBeenCalled();
      expect(db.sequelize.transaction().commit).not.toHaveBeenCalled();
    });
  });
});