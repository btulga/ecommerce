const AddressService = require('../services/address.service');

const AddressController = {
  createAddress: async (req, res) => {
    try {
      // Assuming customer ID comes from authenticated user session or request body
      const { customer_id } = req.body; 
      const address = await AddressService.createAddress(customer_id, req.body);
      res.status(201).json(address);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  listAddresses: async (req, res) => {
    try {
      // Assuming customer ID comes from authenticated user session or query params
      const { customerId } = req.params;
      const addresses = await AddressService.listByCustomer(customerId);
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const address = await AddressService.getAddress(id);
      res.status(200).json(address);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  updateAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedAddress = await AddressService.updateAddress(id, req.body);
      res.status(200).json(updatedAddress);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;
      await AddressService.deleteAddress(id);
      res.status(200).json({ message: 'Address deleted successfully.' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};

module.exports = AddressController;
