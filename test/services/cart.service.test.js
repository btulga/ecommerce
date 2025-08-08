const CartService = require('../services/cart.service');
const db = require('../models');
const { mockDeep, mockReset } = require('jest-mock-extended');

jest.mock('../models', () => ({
  Cart: mockDeep(),
  CartItem: mockDeep(),
  Product: mockDeep(),
  ProductVariant: mockDeep(),
  Customer: mockDeep(),
  SalesChannel: mockDeep(),
  Coupon: mockDeep(),
  DiscountRule: mockDeep(),
  sequelize: {
    transaction: mockDeep(),
  },
}));

describe('CartService', () => {
  const mockCartModel = db.Cart;
  const mockCartItemModel = db.CartItem;
  const mockProductVariantModel = db.ProductVariant;
  const mockProductModel = db.Product;
  const mockCustomerModel = db.Customer;
  const mockSalesChannelModel = db.SalesChannel;
  const mockCouponModel = db.Coupon;
  const mockDiscountRuleModel = db.DiscountRule;
  const mockTransaction = db.sequelize.transaction;

  beforeEach(() => {
    mockReset(mockCartModel);
    mockReset(mockCartItemModel);
    mockReset(mockProductVariantModel);
    mockReset(mockProductModel);
    mockReset(mockCustomerModel);
    mockSalesChannelModel.findByPk.mockResolvedValue({ id: 'test_channel_id' }); // Assume a default sales channel exists
    mockReset(mockCouponModel);
    mockReset(mockDiscountRuleModel);
    mockReset(mockTransaction);
  });

  describe('createCart', () => {
    test('should create a new cart with default values', async () => {
      const mockCreatedCart = {
        id: 'cart_123',
        sales_channel_id: 'test_channel_id',
        type: 'default',
        items: [],
        save: jest.fn().mockResolvedValue(true),
      };
      mockCartModel.create.mockResolvedValue(mockCreatedCart);

      const cart = await CartService.createCart();

      expect(mockCartModel.create).toHaveBeenCalledWith({
        sales_channel_id: 'test_channel_id',
        type: 'default',
      });
      expect(cart).toEqual(mockCreatedCart);
    });

    test('should create a cart with provided sales channel ID if valid', async () => {
      const providedSalesChannelId = 'provided_channel_id';
      mockSalesChannelModel.findByPk.mockResolvedValueOnce({ id: providedSalesChannelId }); // Mock findByPk for the specific ID
      const mockCreatedCart = {
        id: 'cart_124',
        sales_channel_id: providedSalesChannelId,
        type: 'default',
        items: [],
        save: jest.fn().mockResolvedValue(true),
      };
      mockCartModel.create.mockResolvedValue(mockCreatedCart);

      const cart = await CartService.createCart(providedSalesChannelId);

      expect(mockSalesChannelModel.findByPk).toHaveBeenCalledWith(providedSalesChannelId);
      expect(mockCartModel.create).toHaveBeenCalledWith({
        sales_channel_id: providedSalesChannelId,
        type: 'default',
      });
      expect(cart).toEqual(mockCreatedCart);
    });

    test('should throw error if provided sales channel ID is invalid', async () => {
      const invalidSalesChannelId = 'invalid_channel_id';
      mockSalesChannelModel.findByPk.mockResolvedValue(null); // Mock findByPk to return null

      await expect(CartService.createCart(invalidSalesChannelId)).rejects.toThrow('Invalid sales channel ID');
      expect(mockSalesChannelModel.findByPk).toHaveBeenCalledWith(invalidSalesChannelId);
      expect(mockCartModel.create).not.toHaveBeenCalled();
    });
  });

  describe('getCart', () => {
    test('should return a cart with associated items and relations', async () => {
      const cartId = 'cart_abc';
      const mockCart = {
        id: cartId,
        items: [],
        Customer: null,
        SalesChannel: { id: 'channel_xyz' },
        Coupon: null,
      };
      mockCartModel.findByPk.mockResolvedValue(mockCart);

      const cart = await CartService.getCart(cartId);

      expect(mockCartModel.findByPk).toHaveBeenCalledWith(cartId, {
        include: [
          {
            model: db.CartItem,
            as: 'items',
            include: [
              {
                model: db.ProductVariant,
                as: 'variant',
                include: [{ model: db.Product, as: 'product' }],
              },
            ],
          },
          { model: db.Customer },
          { model: db.SalesChannel },
          {
            model: db.Coupon,
            include: [{ model: db.DiscountRule, as: 'rule' }],
          },
        ],
      });
      expect(cart).toEqual(mockCart);
    });

    test('should return null if cart is not found', async () => {
      const cartId = 'cart_def';
      mockCartModel.findByPk.mockResolvedValue(null);

      const cart = await CartService.getCart(cartId);

      expect(mockCartModel.findByPk).toHaveBeenCalledWith(cartId, expect.any(Object));
      expect(cart).toBeNull();
    });
  });

  describe('addOrUpdateItem', () => {
    const cartId = 'cart_xyz';
    const variantId = 'variant_1';
    const quantity = 5;
    const mockTransactionInstance = {
      commit: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true),
    };

    beforeEach(() => {
      mockTransaction.mockResolvedValue(mockTransactionInstance);
    });

    test('should add a new item if it does not exist in the cart', async () => {
      const mockCart = { id: cartId, items: [], addCartItem: jest.fn().mockResolvedValue(true), save: jest.fn().mockResolvedValue(true) };
      const mockVariant = { id: variantId, product_id: 'prod_1', price: 1000 };
      const mockCreatedCartItem = { id: 'item_123', variant_id: variantId, quantity: quantity };

      mockCartModel.findByPk.mockResolvedValue(mockCart);
      mockProductVariantModel.findByPk.mockResolvedValue(mockVariant);
      mockCartItemModel.create.mockResolvedValue(mockCreatedCartItem);

      const updatedCart = await CartService.addOrUpdateItem(cartId, variantId, quantity);

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockCartModel.findByPk).toHaveBeenCalledWith(cartId, { transaction: mockTransactionInstance });
      expect(mockProductVariantModel.findByPk).toHaveBeenCalledWith(variantId, { transaction: mockTransactionInstance });
      expect(mockCartItemModel.findOne).toHaveBeenCalledWith({
        where: { cart_id: cartId, variant_id: variantId },
        transaction: mockTransactionInstance,
      });
      expect(mockCartItemModel.create).toHaveBeenCalledWith({
        cart_id: cartId,
        variant_id: variantId,
        quantity: quantity,
        unit_price: mockVariant.price,
      }, { transaction: mockTransactionInstance });
      expect(mockCart.addCartItem).not.toHaveBeenCalled(); // Assuming direct create is used
      expect(mockTransactionInstance.commit).toHaveBeenCalled();
      expect(mockTransactionInstance.rollback).not.toHaveBeenCalled();
      // The service returns the updated cart with items included, so we'd need to mock that too
      // For simplicity in this test, we'll check the create call.
    });

    test('should update quantity if item already exists in the cart', async () => {
      const mockExistingCartItem = {
        id: 'item_456',
        variant_id: variantId,
        quantity: 2,
        save: jest.fn().mockResolvedValue(true),
      };
      const mockCart = { id: cartId, items: [mockExistingCartItem], save: jest.fn().mockResolvedValue(true) };
      const mockVariant = { id: variantId, product_id: 'prod_1', price: 1000 };

      mockCartModel.findByPk.mockResolvedValue(mockCart);
      mockProductVariantModel.findByPk.mockResolvedValue(mockVariant);
      mockCartItemModel.findOne.mockResolvedValue(mockExistingCartItem);

      const updatedCart = await CartService.addOrUpdateItem(cartId, variantId, quantity);

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockCartModel.findByPk).toHaveBeenCalledWith(cartId, { transaction: mockTransactionInstance });
      expect(mockProductVariantModel.findByPk).toHaveBeenCalledWith(variantId, { transaction: mockTransactionInstance });
      expect(mockCartItemModel.findOne).toHaveBeenCalledWith({
        where: { cart_id: cartId, variant_id: variantId },
        transaction: mockTransactionInstance,
      });
      expect(mockExistingCartItem.quantity).toBe(2 + quantity);
      expect(mockExistingCartItem.save).toHaveBeenCalledWith({ transaction: mockTransactionInstance });
      expect(mockCartItemModel.create).not.toHaveBeenCalled();
      expect(mockTransactionInstance.commit).toHaveBeenCalled();
      expect(mockTransactionInstance.rollback).not.toHaveBeenCalled();
    });

    test('should remove item if updated quantity is zero or less', async () => {
      const mockExistingCartItem = {
        id: 'item_456',
        variant_id: variantId,
        quantity: 2,
        destroy: jest.fn().mockResolvedValue(true),
      };
      const mockCart = { id: cartId, items: [mockExistingCartItem], save: jest.fn().mockResolvedValue(true) };
      const mockVariant = { id: variantId, product_id: 'prod_1', price: 1000 };
      const quantityToRemove = -2;

      mockCartModel.findByPk.mockResolvedValue(mockCart);
      mockProductVariantModel.findByPk.mockResolvedValue(mockVariant);
      mockCartItemModel.findOne.mockResolvedValue(mockExistingCartItem);

      const updatedCart = await CartService.addOrUpdateItem(cartId, variantId, quantityToRemove);

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockCartModel.findByPk).toHaveBeenCalledWith(cartId, { transaction: mockTransactionInstance });
      expect(mockProductVariantModel.findByPk).toHaveBeenCalledWith(variantId, { transaction: mockTransactionInstance });
      expect(mockCartItemModel.findOne).toHaveBeenCalledWith({
        where: { cart_id: cartId, variant_id: variantId },
        transaction: mockTransactionInstance,
      });
      expect(mockExistingCartItem.quantity).toBe(0); // Quantity is updated before check
      expect(mockExistingCartItem.destroy).toHaveBeenCalledWith({ transaction: mockTransactionInstance });
      expect(mockExistingCartItem.save).not.toHaveBeenCalled();
      expect(mockCartItemModel.create).not.toHaveBeenCalled();
      expect(mockTransactionInstance.commit).toHaveBeenCalled();
      expect(mockTransactionInstance.rollback).not.toHaveBeenCalled();
    });

    test('should throw error if cart not found', async () => {
      mockCartModel.findByPk.mockResolvedValue(null);

      await expect(CartService.addOrUpdateItem(cartId, variantId, quantity)).rejects.toThrow('Cart not found');
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockCartModel.findByPk).toHaveBeenCalledWith(cartId, { transaction: mockTransactionInstance });
      expect(mockTransactionInstance.rollback).toHaveBeenCalled();
      expect(mockTransactionInstance.commit).not.toHaveBeenCalled();
    });

    test('should throw error if variant not found', async () => {
      const mockCart = { id: cartId, items: [] };
      mockCartModel.findByPk.mockResolvedValue(mockCart);
      mockProductVariantModel.findByPk.mockResolvedValue(null);

      await expect(CartService.addOrUpdateItem(cartId, variantId, quantity)).rejects.toThrow('Product variant not found');
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockCartModel.findByPk).toHaveBeenCalledWith(cartId, { transaction: mockTransactionInstance });
      expect(mockProductVariantModel.findByPk).toHaveBeenCalledWith(variantId, { transaction: mockTransactionInstance });
      expect(mockTransactionInstance.rollback).toHaveBeenCalled();
      expect(mockTransactionInstance.commit).not.toHaveBeenCalled();
    });

    test('should rollback transaction on error', async () => {
      const mockCart = { id: cartId, items: [] };
      const mockVariant = { id: variantId, product_id: 'prod_1', price: 1000 };
      const errorMessage = 'Database error';

      mockCartModel.findByPk.mockResolvedValue(mockCart);
      mockProductVariantModel.findByPk.mockResolvedValue(mockVariant);
      mockCartItemModel.findOne.mockRejectedValue(new Error(errorMessage)); // Simulate a database error

      await expect(CartService.addOrUpdateItem(cartId, variantId, quantity)).rejects.toThrow(errorMessage);
      expect(mockTransaction).toHaveBeenCalled();
      expect(mockTransactionInstance.rollback).toHaveBeenCalled();
      expect(mockTransactionInstance.commit).not.toHaveBeenCalled();
    });
  });
});