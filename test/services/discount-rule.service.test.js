const {
  createDiscountRule,
  getDiscountRuleById,
  updateDiscountRule,
  deleteDiscountRule,
  addProductToDiscountRule,
  removeProductFromDiscountRule,
  addSalesChannelToDiscountRule,
  removeSalesChannelFromDiscountRule,
  applyCouponValidation, // Assuming this function exists for validation
} = require('../../src/services/discount-rule.service');

// Mocking Sequelize models
const mockDiscountRuleModel = {
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  findOne: jest.fn(), // Needed for validation
};

const mockProductModel = {
  findByPk: jest.fn(), // Needed for associations
};

const mockSalesChannelModel = {
  findByPk: jest.fn(), // Needed for associations
};

const mockDiscountRuleProductModel = {
  create: jest.fn(),
  destroy: jest.fn(),
  findOne: jest.fn(), // Needed for removing
};

const mockDiscountRuleSalesChannelModel = {
  create: jest.fn(),
  destroy: jest.fn(),
  findOne: jest.fn(), // Needed for removing
};

// Inject mock models into the service (assuming the service is structured to accept them)
// This part might need adjustment based on how the functional service is structured
// If the service directly imports models, you might need to use a mocking library like 'proxyquire'
// For now, we'll assume the service functions are structured to accept model dependencies or
// that we can mock the imported modules directly. Let's assume direct module mocking for now.
jest.mock('../../src/models', () => ({
  DiscountRule: mockDiscountRuleModel,
  Product: mockProductModel,
  SalesChannel: mockSalesChannelModel,
  DiscountRuleProduct: mockDiscountRuleProductModel,
  DiscountRuleSalesChannel: mockDiscountRuleSalesChannelModel,
}));


describe('Discount Rule Service (Functional)', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  describe('createDiscountRule', () => {
    it('should create a new discount rule', async () => {
      const discountRuleData = {
        description: 'Test Discount',
        type: 'fixed',
        value: 10,
      };
      const createdDiscountRule = {
        id: 'rule-1',
        ...discountRuleData,
      };
      mockDiscountRuleModel.create.mockResolvedValue(createdDiscountRule);

      const result = await createDiscountRule(discountRuleData);

      expect(mockDiscountRuleModel.create).toHaveBeenCalledWith(discountRuleData);
      expect(result).toEqual(createdDiscountRule);
    });
  });

  describe('getDiscountRuleById', () => {
    it('should retrieve a discount rule by ID', async () => {
      const discountRuleId = 'rule-1';
      const foundDiscountRule = {
        id: discountRuleId,
        description: 'Test Discount',
      };
      mockDiscountRuleModel.findByPk.mockResolvedValue(foundDiscountRule);

      const result = await getDiscountRuleById(discountRuleId);

      expect(mockDiscountRuleModel.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(result).toEqual(foundDiscountRule);
    });

    it('should return null if discount rule not found', async () => {
      const discountRuleId = 'non-existent-rule';
      mockDiscountRuleModel.findByPk.mockResolvedValue(null);

      const result = await getDiscountRuleById(discountRuleId);

      expect(mockDiscountRuleModel.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(result).toBeNull();
    });
  });

  describe('updateDiscountRule', () => {
    it('should update a discount rule', async () => {
      const discountRuleId = 'rule-1';
      const updateData = {
        description: 'Updated Discount',
        value: 15,
      };
      const mockUpdateResult = [1]; // Sequelize update returns [affectedCount]
      const mockFindAfterUpdate = {
        id: discountRuleId,
        description: 'Updated Discount',
        value: 15,
      };

      mockDiscountRuleModel.update.mockResolvedValue(mockUpdateResult);
      mockDiscountRuleModel.findByPk.mockResolvedValue(mockFindAfterUpdate); // Mock finding after update

      const result = await updateDiscountRule(discountRuleId, updateData);

      expect(mockDiscountRuleModel.update).toHaveBeenCalledWith(updateData, {
        where: {
          id: discountRuleId
        }
      });
      // Assuming the service retrieves the updated record after the update
      expect(mockDiscountRuleModel.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(result).toEqual(mockFindAfterUpdate);
    });

    it('should return null if discount rule not found for update', async () => {
      const discountRuleId = 'non-existent-rule';
      const updateData = {
        description: 'Updated Discount',
      };
      const mockUpdateResult = [0]; // Sequelize update returns [affectedCount] for no match

      mockDiscountRuleModel.update.mockResolvedValue(mockUpdateResult);

      const result = await updateDiscountRule(discountRuleId, updateData);

      expect(mockDiscountRuleModel.update).toHaveBeenCalledWith(updateData, {
        where: {
          id: discountRuleId
        }
      });
      expect(result).toBeNull();
      expect(mockDiscountRuleModel.findByPk).not.toHaveBeenCalled(); // Should not try to find after update
    });
  });

  describe('deleteDiscountRule', () => {
    it('should delete a discount rule', async () => {
      const discountRuleId = 'rule-to-delete';
      const mockDeleteResult = 1; // Sequelize destroy returns affectedCount

      mockDiscountRuleModel.destroy.mockResolvedValue(mockDeleteResult);

      const result = await deleteDiscountRule(discountRuleId);

      expect(mockDiscountRuleModel.destroy).toHaveBeenCalledWith({
        where: {
          id: discountRuleId
        }
      });
      expect(result).toBe(true); // Assuming service returns boolean for success/failure
    });

    it('should return false if discount rule not found for deletion', async () => {
      const discountRuleId = 'non-existent-rule';
      const mockDeleteResult = 0; // Sequelize destroy returns affectedCount for no match

      mockDiscountRuleModel.destroy.mockResolvedValue(mockDeleteResult);

      const result = await deleteDiscountRule(discountRuleId);

      expect(mockDiscountRuleModel.destroy).toHaveBeenCalledWith({
        where: {
          id: discountRuleId
        }
      });
      expect(result).toBe(false); // Assuming service returns boolean for success/failure
    });
  });

  describe('addProductToDiscountRule', () => {
    it('should add a product to a discount rule', async () => {
      const discountRuleId = 'rule-1';
      const productId = 'prod-1';
      const mockDiscountRule = {
        id: discountRuleId
      };
      const mockProduct = {
        id: productId
      };
      const mockJoinEntry = {
        discount_rule_id: discountRuleId,
        product_id: productId,
      };

      mockDiscountRuleModel.findByPk.mockResolvedValue(mockDiscountRule);
      mockProductModel.findByPk.mockResolvedValue(mockProduct);
      mockDiscountRuleProductModel.create.mockResolvedValue(mockJoinEntry);

      const result = await addProductToDiscountRule(discountRuleId, productId);

      expect(mockDiscountRuleModel.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId);
      expect(mockDiscountRuleProductModel.create).toHaveBeenCalledWith({
        discount_rule_id: discountRuleId,
        product_id: productId,
      });
      expect(result).toEqual(mockJoinEntry); // Or whatever the service is designed to return
    });

    it('should return null if discount rule or product not found when adding product', async () => {
      const discountRuleId = 'non-existent-rule';
      const productId = 'prod-1';

      mockDiscountRuleModel.findByPk.mockResolvedValue(null); // Rule not found
      mockProductModel.findByPk.mockResolvedValue({
        id: productId
      }); // Product found

      const result = await addProductToDiscountRule(discountRuleId, productId);

      expect(mockDiscountRuleModel.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId); // Product lookup might still happen
      expect(mockDiscountRuleProductModel.create).not.toHaveBeenCalled();
      expect(result).toBeNull();

      // Reset mocks
      jest.clearAllMocks();

      mockDiscountRuleModel.findByPk.mockResolvedValue({
        id: discountRuleId
      }); // Rule found
      mockProductModel.findByPk.mockResolvedValue(null); // Product not found

      const result2 = await addProductToDiscountRule(discountRuleId, productId);

      expect(mockDiscountRuleModel.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(mockProductModel.findByPk).toHaveBeenCalledWith(productId);
      expect(mockDiscountRuleProductModel.create).not.toHaveBeenCalled();
      expect(result2).toBeNull();
    });
  });

  describe('removeProductFromDiscountRule', () => {
    it('should remove a product from a discount rule', async () => {
      const discountRuleId = 'rule-1';
      const productId = 'prod-1';
      const mockJoinEntry = {
        destroy: jest.fn().mockResolvedValue(1)
      }; // Mock the destroy method on the found join entry

      mockDiscountRuleProductModel.findOne.mockResolvedValue(mockJoinEntry);

      const result = await removeProductFromDiscountRule(discountRuleId, productId);

      expect(mockDiscountRuleProductModel.findOne).toHaveBeenCalledWith({
        where: {
          discount_rule_id: discountRuleId,
          product_id: productId,
        }
      });
      expect(mockJoinEntry.destroy).toHaveBeenCalled();
      expect(result).toBe(true); // Assuming service returns boolean for success/failure
    });

    it('should return false if the product association does not exist when removing product', async () => {
      const discountRuleId = 'rule-1';
      const productId = 'prod-non-existent';

      mockDiscountRuleProductModel.findOne.mockResolvedValue(null);

      const result = await removeProductFromDiscountRule(discountRuleId, productId);

      expect(mockDiscountRuleProductModel.findOne).toHaveBeenCalledWith({
        where: {
          discount_rule_id: discountRuleId,
          product_id: productId,
        }
      });
      expect(result).toBe(false);
    });
  });

  describe('addSalesChannelToDiscountRule', () => {
    it('should add a sales channel to a discount rule', async () => {
      const discountRuleId = 'rule-1';
      const salesChannelId = 'sc-1';
      const mockDiscountRule = {
        id: discountRuleId
      };
      const mockSalesChannel = {
        id: salesChannelId
      };
      const mockJoinEntry = {
        discount_rule_id: discountRuleId,
        sales_channel_id: salesChannelId,
      };

      mockDiscountRuleModel.findByPk.mockResolvedValue(mockDiscountRule);
      mockSalesChannelModel.findByPk.mockResolvedValue(mockSalesChannel);
      mockDiscountRuleSalesChannelModel.create.mockResolvedValue(mockJoinEntry);

      const result = await addSalesChannelToDiscountRule(discountRuleId, salesChannelId);

      expect(mockDiscountRuleModel.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(mockSalesChannelModel.findByPk).toHaveBeenCalledWith(salesChannelId);
      expect(mockDiscountRuleSalesChannelModel.create).toHaveBeenCalledWith({
        discount_rule_id: discountRuleId,
        sales_channel_id: salesChannelId,
      });
      expect(result).toEqual(mockJoinEntry); // Or whatever the service is designed to return
    });

    it('should return null if discount rule or sales channel not found when adding sales channel', async () => {
      const discountRuleId = 'non-existent-rule';
      const salesChannelId = 'sc-1';

      mockDiscountRuleModel.findByPk.mockResolvedValue(null); // Rule not found
      mockSalesChannelModel.findByPk.mockResolvedValue({
        id: salesChannelId
      }); // Sales Channel found

      const result = await addSalesChannelToDiscountRule(discountRuleId, salesChannelId);

      expect(mockDiscountRuleModel.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(mockSalesChannelModel.findByPk).toHaveBeenCalledWith(salesChannelId); // Sales Channel lookup might still happen
      expect(mockDiscountRuleSalesChannelModel.create).not.toHaveBeenCalled();
      expect(result).toBeNull();

      // Reset mocks
      jest.clearAllMocks();

      mockDiscountRuleModel.findByPk.mockResolvedValue({
        id: discountRuleId
      }); // Rule found
      mockSalesChannelModel.findByPk.mockResolvedValue(null); // Sales Channel not found

      const result2 = await addSalesChannelToDiscountRule(discountRuleId, salesChannelId);

      expect(mockDiscountRuleModel.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(mockSalesChannelModel.findByPk).toHaveBeenCalledWith(salesChannelId);
      expect(mockDiscountRuleSalesChannelModel.create).not.toHaveBeenCalled();
      expect(result2).toBeNull();
    });
  });

  describe('removeSalesChannelFromDiscountRule', () => {
    it('should remove a sales channel from a discount rule', async () => {
      const discountRuleId = 'rule-1';
      const salesChannelId = 'sc-1';
      const mockJoinEntry = {
        destroy: jest.fn().mockResolvedValue(1)
      }; // Mock the destroy method on the found join entry

      mockDiscountRuleSalesChannelModel.findOne.mockResolvedValue(mockJoinEntry);

      const result = await removeSalesChannelFromDiscountRule(discountRuleId, salesChannelId);

      expect(mockDiscountRuleSalesChannelModel.findOne).toHaveBeenCalledWith({
        where: {
          discount_rule_id: discountRuleId,
          sales_channel_id: salesChannelId,
        }
      });
      expect(mockJoinEntry.destroy).toHaveBeenCalled();
      expect(result).toBe(true); // Assuming service returns boolean for success/failure
    });

    it('should return false if the sales channel association does not exist when removing sales channel', async () => {
      const discountRuleId = 'rule-1';
      const salesChannelId = 'sc-non-existent';

      mockDiscountRuleSalesChannelModel.findOne.mockResolvedValue(null);

      const result = await removeSalesChannelFromDiscountRule(discountRuleId, salesChannelId);

      expect(mockDiscountRuleSalesChannelModel.findOne).toHaveBeenCalledWith({
        where: {
          discount_rule_id: discountRuleId,
          sales_channel_id: salesChannelId,
        }
      });
      expect(result).toBe(false);
    });
  });

  // Add tests for applyCouponValidation based on its expected functionality
  // describe('applyCouponValidation', () => {
  //   it('should validate a coupon for a given sales channel and cart items', async () => {
  //     // Mock data and expected behavior for validation
  //     const couponCode = 'VALIDCOUPON';
  //     const salesChannelId = 'sc-1';
  //     const cartItems = [{ product_id: 'prod-1', quantity: 1 }];
  //     const mockDiscountRule = {
  //       // ... mock discount rule details including associations
  //     };
  //
  //     // Mock necessary service dependencies (e.g., finding the coupon and its associated discount rule)
  //     // mockCouponModel.findOne.mockResolvedValue(...);
  //     // mockDiscountRuleModel.findByPk.mockResolvedValue(mockDiscountRule);
  //
  //     const isValid = await applyCouponValidation(couponCode, salesChannelId, cartItems);
  //
  //     expect(isValid).toBe(true); // Or false depending on the test case
  //   });

  //   it('should return false for an invalid coupon code', async () => {
  //     const couponCode = 'INVALIDCOUPON';
  //     const salesChannelId = 'sc-1';
  //     const cartItems = [{ product_id: 'prod-1', quantity: 1 }];
  //
  //     // Mock coupon not found
  //     // mockCouponModel.findOne.mockResolvedValue(null);
  //
  //     const isValid = await applyCouponValidation(couponCode, salesChannelId, cartItems);
  //
  //     expect(isValid).toBe(false);
  //   });

  //   // Add more tests for different validation scenarios (sales channel mismatch, product not applicable, etc.)
  // });

});