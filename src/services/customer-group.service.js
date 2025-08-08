'use strict';

const { CustomerGroup, CustomerGroupCustomer } = require('../models');

class CustomerGroupService {
  /**
   * Creates a new customer group.
   * @param {object} data - The data for the new customer group.
   * @param {string} data.name - The name of the customer group.
   * @returns {Promise<CustomerGroup>} The created customer group.
   */
  async create(data) {
    return CustomerGroup.create(data);
  }

  /**
   * Finds a customer group by ID.
   * @param {string} id - The ID of the customer group to find.
   * @returns {Promise<CustomerGroup|null>} The found customer group or null if not found.
   */
  async findById(id) {
    return CustomerGroup.findByPk(id, {
      include: ['customers'] // Include associated customers
    });
  }

  /**
   * Finds all customer groups.
   * @returns {Promise<CustomerGroup[]>} A list of all customer groups.
   */
  async findAll() {
    return CustomerGroup.findAll({
      include: ['customers'] // Include associated customers
    });
  }

  /**
   * Updates a customer group.
   * @param {string} id - The ID of the customer group to update.
   * @param {object} data - The data to update the customer group with.
   * @returns {Promise<[number, CustomerGroup[]]>} The number of affected rows and the updated customer group(s).
   */
  async update(id, data) {
    return CustomerGroup.update(data, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Deletes a customer group.
   * @param {string} id - The ID of the customer group to delete.
   * @returns {Promise<number>} The number of rows deleted.
   */
  async delete(id) {
    return CustomerGroup.destroy({
      where: { id },
    });
  }

  /**
   * Adds a customer to a customer group.
   * @param {string} customerGroupId - The ID of the customer group.
   * @param {string} customerId - The ID of the customer to add.
   * @returns {Promise<CustomerGroupCustomer>} The created join table entry.
   */
  async addCustomerToGroup(customerGroupId, customerId) {
    // Check if the relationship already exists to avoid duplicates
    const existing = await CustomerGroupCustomer.findOne({
      where: { customer_group_id: customerGroupId, customer_id: customerId },
    });

    if (existing) {
      // Relationship already exists, maybe return the existing one or throw an error
      return existing;
    }

    return CustomerGroupCustomer.create({
      customer_group_id: customerGroupId,
      customer_id: customerId,
    });
  }

  /**
   * Removes a customer from a customer group.
   * @param {string} customerGroupId - The ID of the customer group.
   * @param {string} customerId - The ID of the customer to remove.
   * @returns {Promise<number>} The number of rows deleted from the join table.
   */
  async removeCustomerFromGroup(customerGroupId, customerId) {
    return CustomerGroupCustomer.destroy({
      where: {
        customer_group_id: customerGroupId,
        customer_id: customerId,
      },
    });
  }
}

module.exports = new CustomerGroupService();