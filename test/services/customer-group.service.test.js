const CustomerGroupService = require('../services/customer-group.service');
const { CustomerGroup, CustomerGroupCustomer } = require('../models');

// Mock the models
jest.mock('../models', () => ({
  CustomerGroup: {
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(), // Added for findAll test
  },
  CustomerGroupCustomer: {
    create: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn(), // Added for addCustomerToGroup test
  },
  DiscountRuleCustomerGroup: { // Added for discount rule association tests
    create: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe('CustomerGroupService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('createCustomerGroup', () => {
    it('should create a new customer group successfully', async () => {
      const groupData = { name: 'VIP Customers' };
      const createdGroup = { id: 'group1', ...groupData };
      CustomerGroup.create.mockResolvedValue(createdGroup);

      const result = await CustomerGroupService.createCustomerGroup(groupData);

      expect(CustomerGroup.create).toHaveBeenCalledWith(groupData);
      expect(result).toEqual(createdGroup);
    });

    it('should throw an error if creation fails', async () => {
      const groupData = { name: 'VIP Customers' };
      const createError = new Error('Failed to create group');
      CustomerGroup.create.mockRejectedValue(createError);

      await expect(CustomerGroupService.createCustomerGroup(groupData)).rejects.toThrow('Failed to create group');
      expect(CustomerGroup.create).toHaveBeenCalledWith(groupData);
    });
  });

  describe('getCustomerGroupById', () => {
    it('should find a customer group by ID successfully', async () => {
      const groupId = 'group1';
      const foundGroup = { id: groupId, name: 'VIP Customers' };
      CustomerGroup.findByPk.mockResolvedValue(foundGroup);

      const result = await CustomerGroupService.getCustomerGroupById(groupId);

      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId, { include: ['customers'] });
      expect(result).toEqual(foundGroup);
    });

    it('should return null if customer group is not found', async () => {
      const groupId = 'nonexistent-group';
      CustomerGroup.findByPk.mockResolvedValue(null);

      const result = await CustomerGroupService.getCustomerGroupById(groupId);

      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId, { include: ['customers'] });
      expect(result).toBeNull();
    });
  });

  describe('getAllCustomerGroups', () => {
    it('should return all customer groups successfully', async () => {
      const foundGroups = [{ id: 'group1', name: 'VIP Customers' }];
      CustomerGroup.findAll.mockResolvedValue(foundGroups);

      const result = await CustomerGroupService.getAllCustomerGroups();

      expect(CustomerGroup.findAll).toHaveBeenCalledWith({ include: ['customers'] });
      expect(result).toEqual(foundGroups);
    });
  });

  describe('updateCustomerGroup', () => {
    it('should update a customer group successfully', async () => {
      const groupId = 'group1';
      const updateData = { name: 'Super VIP Customers' };
      const updatedRows = [1, [{ id: groupId, name: 'Super VIP Customers' }]];
      CustomerGroup.update.mockResolvedValue(updatedRows);

      const result = await CustomerGroupService.updateCustomerGroup(groupId, updateData);

      expect(CustomerGroup.update).toHaveBeenCalledWith(updateData, { where: { id: groupId }, returning: true });
      expect(result).toEqual(updatedRows);
    });

    it('should throw an error if update fails', async () => {
      const groupId = 'group1';
      const updateData = { name: 'Super VIP Customers' };
      const updateError = new Error('Failed to update group');
      CustomerGroup.update.mockRejectedValue(updateError);

      await expect(CustomerGroupService.updateCustomerGroup(groupId, updateData)).rejects.toThrow('Failed to update group');
      expect(CustomerGroup.update).toHaveBeenCalledWith(updateData, { where: { id: groupId }, returning: true });
    });
  });

  describe('removeCustomerGroup', () => {
    it('should delete a customer group successfully', async () => {
      const groupId = 'group1';
      CustomerGroup.destroy.mockResolvedValue(1);

      const result = await CustomerGroupService.removeCustomerGroup(groupId);

      expect(CustomerGroup.destroy).toHaveBeenCalledWith({ where: { id: groupId } });
      expect(result).toBe(1);
    });

    it('should return 0 if customer group to delete is not found', async () => {
      const groupId = 'nonexistent-group';
      CustomerGroup.destroy.mockResolvedValue(0);

      const result = await CustomerGroupService.removeCustomerGroup(groupId);

      expect(CustomerGroup.destroy).toHaveBeenCalledWith({ where: { id: groupId } });
      expect(result).toBe(0);
    });

    it('should throw an error if deletion fails', async () => {
      const groupId = 'group1';
      const deleteError = new Error('Failed to delete group');
      CustomerGroup.destroy.mockRejectedValue(deleteError);

      await expect(CustomerGroupService.removeCustomerGroup(groupId)).rejects.toThrow('Failed to delete group');
      expect(CustomerGroup.destroy).toHaveBeenCalledWith({ where: { id: groupId } });
    });
  });

  describe('addCustomerToGroup', () => {
    it('should add a customer to a group successfully', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      const createdEntry = { customer_group_id: groupId, customer_id: customerId };

      CustomerGroupCustomer.findOne.mockResolvedValue(null); // No existing relationship
      CustomerGroupCustomer.create.mockResolvedValue(createdEntry);

      const result = await CustomerGroupService.addCustomerToGroup(groupId, customerId);

      expect(CustomerGroupCustomer.findOne).toHaveBeenCalledWith({
        where: { customer_group_id: groupId, customer_id: customerId },
      });
      expect(CustomerGroupCustomer.create).toHaveBeenCalledWith({
        customer_group_id: groupId,
        customer_id: customerId,
      });
      expect(result).toEqual(createdEntry);
    });

    it('should return existing entry if relationship already exists', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      const existingEntry = { customer_group_id: groupId, customer_id: customerId };

      CustomerGroupCustomer.findOne.mockResolvedValue(existingEntry);

      const result = await CustomerGroupService.addCustomerToGroup(groupId, customerId);

      expect(CustomerGroupCustomer.findOne).toHaveBeenCalledWith({
        where: { customer_group_id: groupId, customer_id: customerId },
      });
      expect(CustomerGroupCustomer.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingEntry);
    });

    it('should throw an error if adding customer to group fails', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      const createError = new Error('Failed to add customer to group');

      CustomerGroupCustomer.findOne.mockResolvedValue(null);
      CustomerGroupCustomer.create.mockRejectedValue(createError);

      await expect(CustomerGroupService.addCustomerToGroup(groupId, customerId)).rejects.toThrow('Failed to add customer to group');
      expect(CustomerGroupCustomer.create).toHaveBeenCalledWith({
        customer_group_id: groupId,
        customer_id: customerId,
      });
    });
  });

  describe('removeCustomerFromGroup', () => {
    it('should remove a customer from a group successfully', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      CustomerGroupCustomer.destroy.mockResolvedValue(1);

      const result = await CustomerGroupService.removeCustomerFromGroup(groupId, customerId);

      expect(CustomerGroupCustomer.destroy).toHaveBeenCalledWith({
        where: {
          customer_group_id: groupId,
          customer_id: customerId,
        },
      });
      expect(result).toBe(1);
    });

    it('should return 0 if customer group customer entry is not found', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      CustomerGroupCustomer.destroy.mockResolvedValue(0);

      const result = await CustomerGroupService.removeCustomerFromGroup(groupId, customerId);

      expect(CustomerGroupCustomer.destroy).toHaveBeenCalledWith({
        where: {
          customer_group_id: groupId,
          customer_id: customerId,
        },
      });
      expect(result).toBe(0);
    });

    it('should throw an error if removing customer from group fails', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      const deleteError = new Error('Failed to remove customer from group');
      CustomerGroupCustomer.destroy.mockRejectedValue(deleteError);

      await expect(CustomerGroupService.removeCustomerFromGroup(groupId, customerId)).rejects.toThrow('Failed to remove customer from group');
      expect(CustomerGroupCustomer.destroy).toHaveBeenCalledWith({
        where: {
          customer_group_id: groupId,
          customer_id: customerId,
        },
      });
    });
  });

  describe('addDiscountRuleToGroup', () => {
    it('should add a discount rule to a group successfully', async () => {
      const groupId = 'group1';
      const discountRuleId = 'rule1';
      const createdEntry = { customer_group_id: groupId, discount_rule_id: discountRuleId };

      DiscountRuleCustomerGroup.findOne.mockResolvedValue(null);
      DiscountRuleCustomerGroup.create.mockResolvedValue(createdEntry);

      const result = await CustomerGroupService.addDiscountRuleToGroup(groupId, discountRuleId);

      expect(DiscountRuleCustomerGroup.findOne).toHaveBeenCalledWith({
        where: { customer_group_id: groupId, discount_rule_id: discountRuleId },
      });
      expect(DiscountRuleCustomerGroup.create).toHaveBeenCalledWith({
        customer_group_id: groupId,
        discount_rule_id: discountRuleId,
      });
      expect(result).toEqual(createdEntry);
    });

    it('should return existing entry if relationship already exists', async () => {
      const groupId = 'group1';
      const discountRuleId = 'rule1';
      const existingEntry = { customer_group_id: groupId, discount_rule_id: discountRuleId };

      DiscountRuleCustomerGroup.findOne.mockResolvedValue(existingEntry);

      const result = await CustomerGroupService.addDiscountRuleToGroup(groupId, discountRuleId);

      expect(DiscountRuleCustomerGroup.findOne).toHaveBeenCalledWith({
        where: { customer_group_id: groupId, discount_rule_id: discountRuleId },
      });
      expect(DiscountRuleCustomerGroup.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingEntry);
    });

    it('should throw an error if adding discount rule to group fails', async () => {
      const groupId = 'group1';
      const discountRuleId = 'rule1';
      const createError = new Error('Failed to add discount rule to group');

      DiscountRuleCustomerGroup.findOne.mockResolvedValue(null);
      DiscountRuleCustomerGroup.create.mockRejectedValue(createError);

      await expect(CustomerGroupService.addDiscountRuleToGroup(groupId, discountRuleId)).rejects.toThrow('Failed to add discount rule to group');
      expect(DiscountRuleCustomerGroup.create).toHaveBeenCalledWith({
        customer_group_id: groupId,
        discount_rule_id: discountRuleId,
      });
    });
  });

  describe('removeDiscountRuleFromGroup', () => {
    it('should remove a discount rule from a group successfully', async () => {
      const groupId = 'group1';
      const discountRuleId = 'rule1';
      DiscountRuleCustomerGroup.destroy.mockResolvedValue(1);

      const result = await CustomerGroupService.removeDiscountRuleFromGroup(groupId, discountRuleId);

      expect(DiscountRuleCustomerGroup.destroy).toHaveBeenCalledWith({
        where: { customer_group_id: groupId, discount_rule_id: discountRuleId },
      });
      expect(result).toBe(1);
    });

    it('should return 0 if discount rule customer group entry is not found', async () => {
      const groupId = 'group1';
      const discountRuleId = 'rule1';
      DiscountRuleCustomerGroup.destroy.mockResolvedValue(0);

      const result = await CustomerGroupService.removeDiscountRuleFromGroup(groupId, discountRuleId);

      expect(DiscountRuleCustomerGroup.destroy).toHaveBeenCalledWith({
        where: { customer_group_id: groupId, discount_rule_id: discountRuleId },
      });
      expect(result).toBe(0);
    });

    it('should throw an error if removing discount rule from group fails', async () => {
      const groupId = 'group1';
      const discountRuleId = 'rule1';
      const deleteError = new Error('Failed to remove discount rule from group');
      DiscountRuleCustomerGroup.destroy.mockRejectedValue(deleteError);

      await expect(CustomerGroupService.removeDiscountRuleFromGroup(groupId, discountRuleId)).rejects.toThrow('Failed to remove discount rule from group');
      expect(DiscountRuleCustomerGroup.destroy).toHaveBeenCalledWith({
        where: { customer_group_id: groupId, discount_rule_id: discountRuleId },
      });
    });
  });
});