const { v4: uuidv4 } = require('uuid');
const DiscountRuleService = require('../../src/services/discount-rule.service');
const {
  DiscountRule,
  CustomerGroup,
  DiscountRuleCustomerGroup,
  Product,
} = require('../../src/models'); // Adjust the path as needed

jest.mock('../../src/models', () => ({
  DiscountRule: {
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  CustomerGroup: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  DiscountRuleCustomerGroup: {
    create: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
  Product: {
    findByPk: jest.fn(),
  },
}));

describe('DiscountRuleService', () => {
  let discountRuleService;

  beforeEach(() => {
    discountRuleService = new DiscountRuleService();
    jest.clearAllMocks();
  });

  describe('applyDiscountRuleToCustomerGroup', () => {
    it('should apply a discount rule to a customer group', async () => {
      const discountRuleId = uuidv4();
      const customerGroupId = uuidv4();

      DiscountRule.findByPk.mockResolvedValue({
        id: discountRuleId,
        percentage: 10,
        startDate: new Date(),
      });
      CustomerGroup.findByPk.mockResolvedValue({ id: customerGroupId, name: 'VIP' });
      DiscountRuleCustomerGroup.findOne.mockResolvedValue(null);
      DiscountRuleCustomerGroup.create.mockResolvedValue({
        discountRuleId,
        customerGroupId,
      });

      const result = await discountRuleService.applyDiscountRuleToCustomerGroup(
        discountRuleId,
        customerGroupId
      );

      expect(DiscountRule.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(customerGroupId);
      expect(DiscountRuleCustomerGroup.findOne).toHaveBeenCalledWith({
        where: { discountRuleId, customerGroupId },
      });
      expect(DiscountRuleCustomerGroup.create).toHaveBeenCalledWith({
        discountRuleId,
        customerGroupId,
      });
      expect(result).toEqual({ discountRuleId, customerGroupId });
    });

    it('should throw an error if the discount rule does not exist', async () => {
      const discountRuleId = uuidv4();
      const customerGroupId = uuidv4();

      DiscountRule.findByPk.mockResolvedValue(null);

      await expect(
        discountRuleService.applyDiscountRuleToCustomerGroup(discountRuleId, customerGroupId)
      ).rejects.toThrow(`Discount rule with id ${discountRuleId} not found.`);
      expect(DiscountRule.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(CustomerGroup.findByPk).not.toHaveBeenCalled();
      expect(DiscountRuleCustomerGroup.findOne).not.toHaveBeenCalled();
      expect(DiscountRuleCustomerGroup.create).not.toHaveBeenCalled();
    });

    it('should throw an error if the customer group does not exist', async () => {
      const discountRuleId = uuidv4();
      const customerGroupId = uuidv4();

      DiscountRule.findByPk.mockResolvedValue({
        id: discountRuleId,
        percentage: 10,
        startDate: new Date(),
      });
      CustomerGroup.findByPk.mockResolvedValue(null);

      await expect(
        discountRuleService.applyDiscountRuleToCustomerGroup(discountRuleId, customerGroupId)
      ).rejects.toThrow(`Customer group with id ${customerGroupId} not found.`);
      expect(DiscountRule.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(customerGroupId);
      expect(DiscountRuleCustomerGroup.findOne).not.toHaveBeenCalled();
      expect(DiscountRuleCustomerGroup.create).not.toHaveBeenCalled();
    });

    it('should throw an error if the discount rule is already applied to the customer group', async () => {
      const discountRuleId = uuidv4();
      const customerGroupId = uuidv4();

      DiscountRule.findByPk.mockResolvedValue({
        id: discountRuleId,
        percentage: 10,
        startDate: new Date(),
      });
      CustomerGroup.findByPk.mockResolvedValue({ id: customerGroupId, name: 'VIP' });
      DiscountRuleCustomerGroup.findOne.mockResolvedValue({
        discountRuleId,
        customerGroupId,
      });

      await expect(
        discountRuleService.applyDiscountRuleToCustomerGroup(discountRuleId, customerGroupId)
      ).rejects.toThrow(
        `Discount rule with id ${discountRuleId} is already applied to customer group with id ${customerGroupId}.`
      );
      expect(DiscountRule.findByPk).toHaveBeenCalledWith(discountRuleId);
      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(customerGroupId);
      expect(DiscountRuleCustomerGroup.findOne).toHaveBeenCalledWith({
        where: { discountRuleId, customerGroupId },
      });
      expect(DiscountRuleCustomerGroup.create).not.toHaveBeenCalled();
    });
  });

  describe('removeDiscountRuleFromCustomerGroup', () => {
    it('should remove a discount rule from a customer group', async () => {
      const discountRuleId = uuidv4();
      const customerGroupId = uuidv4();
      const mockAssociation = {
        destroy: jest.fn().mockResolvedValue(1),
      };

      DiscountRuleCustomerGroup.findOne.mockResolvedValue(mockAssociation);

      const result = await discountRuleService.removeDiscountRuleFromCustomerGroup(
        discountRuleId,
        customerGroupId
      );

      expect(DiscountRuleCustomerGroup.findOne).toHaveBeenCalledWith({
        where: { discountRuleId, customerGroupId },
      });
      expect(mockAssociation.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if the discount rule is not applied to the customer group', async () => {
      const discountRuleId = uuidv4();
      const customerGroupId = uuidv4();

      DiscountRuleCustomerGroup.findOne.mockResolvedValue(null);

      const result = await discountRuleService.removeDiscountRuleFromCustomerGroup(
        discountRuleId,
        customerGroupId
      );

      expect(DiscountRuleCustomerGroup.findOne).toHaveBeenCalledWith({
        where: { discountRuleId, customerGroupId },
      });
      expect(result).toBe(false);
    });
  });
});