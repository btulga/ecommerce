const CustomerGroupService = require('../services/customer-group.service'); // Adjust the path as necessary
const { CustomerGroup, CustomerGroupCustomer } = require('../models'); // Adjust the path as necessary

// Mock the models
jest.mock('../models', () => ({
  CustomerGroup: {
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  CustomerGroupCustomer: {
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('CustomerGroupService', () => {
  let customerGroupService;

  beforeEach(() => {
    customerGroupService = new CustomerGroupService();
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('createCustomerGroup', () => {
    it('should create a new customer group successfully', async () => {
      const groupData = { name: 'VIP Customers' };
      const createdGroup = { id: 'group1', ...groupData };
      CustomerGroup.create.mockResolvedValue(createdGroup);

      const result = await customerGroupService.createCustomerGroup(groupData);

      expect(CustomerGroup.create).toHaveBeenCalledWith(groupData);
      expect(result).toEqual(createdGroup);
    });

    it('should throw an error if creation fails', async () => {
      const groupData = { name: 'VIP Customers' };
      const createError = new Error('Failed to create group');
      CustomerGroup.create.mockRejectedValue(createError);

      await expect(customerGroupService.createCustomerGroup(groupData)).rejects.toThrow('Failed to create group');
      expect(CustomerGroup.create).toHaveBeenCalledWith(groupData);
    });
  });

  describe('findCustomerGroupById', () => {
    it('should find a customer group by ID successfully', async () => {
      const groupId = 'group1';
      const foundGroup = { id: groupId, name: 'VIP Customers' };
      CustomerGroup.findByPk.mockResolvedValue(foundGroup);

      const result = await customerGroupService.findCustomerGroupById(groupId);

      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId);
      expect(result).toEqual(foundGroup);
    });

    it('should return null if customer group is not found', async () => {
      const groupId = 'nonexistent-group';
      CustomerGroup.findByPk.mockResolvedValue(null);

      const result = await customerGroupService.findCustomerGroupById(groupId);

      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId);
      expect(result).toBeNull();
    });
  });

  describe('updateCustomerGroup', () => {
    it('should update a customer group successfully', async () => {
      const groupId = 'group1';
      const updateData = { name: 'Super VIP Customers' };
      const existingGroup = { id: groupId, name: 'VIP Customers', update: jest.fn() };
      CustomerGroup.findByPk.mockResolvedValue(existingGroup);
      existingGroup.update.mockResolvedValue([1, [existingGroup]]); // Simulate successful update

      const result = await customerGroupService.updateCustomerGroup(groupId, updateData);

      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId);
      expect(existingGroup.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(existingGroup);
    });

    it('should return null if customer group to update is not found', async () => {
      const groupId = 'nonexistent-group';
      const updateData = { name: 'Super VIP Customers' };
      CustomerGroup.findByPk.mockResolvedValue(null);

      const result = await customerGroupService.updateCustomerGroup(groupId, updateData);

      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId);
      expect(result).toBeNull();
    });

    it('should throw an error if update fails', async () => {
      const groupId = 'group1';
      const updateData = { name: 'Super VIP Customers' };
      const existingGroup = { id: groupId, name: 'VIP Customers', update: jest.fn() };
      const updateError = new Error('Failed to update group');
      CustomerGroup.findByPk.mockResolvedValue(existingGroup);
      existingGroup.update.mockRejectedValue(updateError);

      await expect(customerGroupService.updateCustomerGroup(groupId, updateData)).rejects.toThrow('Failed to update group');
      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId);
      expect(existingGroup.update).toHaveBeenCalledWith(updateData);
    });
  });

  describe('deleteCustomerGroup', () => {
    it('should delete a customer group successfully', async () => {
      const groupId = 'group1';
      const existingGroup = { id: groupId, destroy: jest.fn() };
      CustomerGroup.findByPk.mockResolvedValue(existingGroup);
      existingGroup.destroy.mockResolvedValue(1); // Simulate successful deletion

      const result = await customerGroupService.deleteCustomerGroup(groupId);

      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId);
      expect(existingGroup.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if customer group to delete is not found', async () => {
      const groupId = 'nonexistent-group';
      CustomerGroup.findByPk.mockResolvedValue(null);

      const result = await customerGroupService.deleteCustomerGroup(groupId);

      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId);
      expect(result).toBe(false);
    });

    it('should throw an error if deletion fails', async () => {
      const groupId = 'group1';
      const existingGroup = { id: groupId, destroy: jest.fn() };
      const deleteError = new Error('Failed to delete group');
      CustomerGroup.findByPk.mockResolvedValue(existingGroup);
      existingGroup.destroy.mockRejectedValue(deleteError);

      await expect(customerGroupService.deleteCustomerGroup(groupId)).rejects.toThrow('Failed to delete group');
      expect(CustomerGroup.findByPk).toHaveBeenCalledWith(groupId);
      expect(existingGroup.destroy).toHaveBeenCalled();
    });
  });

  describe('addCustomerToGroup', () => {
    it('should add a customer to a group successfully', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      const createdEntry = { customer_group_id: groupId, customer_id: customerId };
      CustomerGroupCustomer.create.mockResolvedValue(createdEntry);

      const result = await customerGroupService.addCustomerToGroup(groupId, customerId);

      expect(CustomerGroupCustomer.create).toHaveBeenCalledWith({
        customer_group_id: groupId,
        customer_id: customerId,
      });
      expect(result).toEqual(createdEntry);
    });

    it('should throw an error if adding customer to group fails', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      const createError = new Error('Failed to add customer to group');
      CustomerGroupCustomer.create.mockRejectedValue(createError);

      await expect(customerGroupService.addCustomerToGroup(groupId, customerId)).rejects.toThrow('Failed to add customer to group');
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
      CustomerGroupCustomer.destroy.mockResolvedValue(1); // Simulate successful deletion

      const result = await customerGroupService.removeCustomerFromGroup(groupId, customerId);

      expect(CustomerGroupCustomer.destroy).toHaveBeenCalledWith({
        where: {
          customer_group_id: groupId,
          customer_id: customerId,
        },
      });
      expect(result).toBe(true);
    });

    it('should return false if customer group customer entry is not found', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      CustomerGroupCustomer.destroy.mockResolvedValue(0); // Simulate no deletion

      const result = await customerGroupService.removeCustomerFromGroup(groupId, customerId);

      expect(CustomerGroupCustomer.destroy).toHaveBeenCalledWith({
        where: {
          customer_group_id: groupId,
          customer_id: customerId,
        },
      });
      expect(result).toBe(false);
    });

    it('should throw an error if removing customer from group fails', async () => {
      const groupId = 'group1';
      const customerId = 'customer1';
      const deleteError = new Error('Failed to remove customer from group');
      CustomerGroupCustomer.destroy.mockRejectedValue(deleteError);

      await expect(customerGroupService.removeCustomerFromGroup(groupId, customerId)).rejects.toThrow('Failed to remove customer from group');
      expect(CustomerGroupCustomer.destroy).toHaveBeenCalledWith({
        where: {
          customer_group_id: groupId,
          customer_id: customerId,
        },
      });
    });
  });
});