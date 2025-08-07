const db = require('../models');

const AddressService = {
  /**
   * Creates a new address for a customer.
   * @param {string} customerId The ID of the customer.
   * @param {object} addressData The address data.
   * @returns {Promise<object>} The created address.
   */
  createAddress: async (customerId, addressData) => {
    try {
      const customer = await db.Customer.findByPk(customerId);
      if (!customer) {
        throw new Error('Customer not found.');
      }
      
      const address = await db.Address.create({
        ...addressData,
        customer_id: customerId,
      });

      return address;
    } catch (error) {
      console.error("Error creating address:", error);
      throw error;
    }
  },

  /**
   * Lists all addresses for a specific customer.
   * @param {string} customerId The ID of the customer.
   * @returns {Promise<Array<object>>} A list of addresses.
   */
  listByCustomer: async (customerId) => {
    try {
      const addresses = await db.Address.findAll({
        where: { customer_id: customerId },
      });
      return addresses;
    } catch (error) {
      console.error("Error listing addresses:", error);
      throw new Error('Could not retrieve addresses.');
    }
  },

  /**
   * Retrieves a single address by its ID.
   * @param {string} addressId The ID of the address.
   * @returns {Promise<object>} The address object.
   */
  getAddress: async (addressId) => {
    try {
      const address = await db.Address.findByPk(addressId);
      if (!address) {
        throw new Error('Address not found.');
      }
      return address;
    } catch (error) {
        console.error("Error retrieving address:", error);
      throw error;
    }
  },

  /**
   * Updates an address.
   * @param {string} addressId The ID of the address to update.
   * @param {object} updateData The data to update.
   * @returns {Promise<object>} The updated address.
   */
  updateAddress: async (addressId, updateData) => {
    try {
      const address = await db.Address.findByPk(addressId);
      if (!address) {
        throw new Error('Address not found.');
      }
      
      const updatedAddress = await address.update(updateData);
      return updatedAddress;
    } catch (error) {
        console.error("Error updating address:", error);
      throw error;
    }
  },

  /**
   * Deletes an address.
   * @param {string} addressId The ID of the address to delete.
   * @returns {Promise<boolean>} True if deletion was successful.
   */
  deleteAddress: async (addressId) => {
    try {
      const address = await db.Address.findByPk(addressId);
      if (!address) {
        throw new Error('Address not found.');
      }

      await address.destroy();
      return true;
    } catch (error) {
        console.error("Error deleting address:", error);
      throw error;
    }
  },
};

module.exports = AddressService;
