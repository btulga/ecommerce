const customerGroupService = require('../services/customer-group.service');

const createCustomerGroup = async (req, res) => {
  try {
    const customerGroup = await customerGroupService.createCustomerGroup(req.body);
    res.status(201).json(customerGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCustomerGroups = async (req, res) => {
  try {
    const customerGroups = await customerGroupService.getAllCustomerGroups();
    res.status(200).json(customerGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerGroupById = async (req, res) => {
  try {
    const customerGroup = await customerGroupService.getCustomerGroupById(req.params.id);
    if (customerGroup) {
      res.status(200).json(customerGroup);
    } else {
      res.status(404).json({ message: 'Customer group not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCustomerGroup = async (req, res) => {
  try {
    const updatedCustomerGroup = await customerGroupService.updateCustomerGroup(req.params.id, req.body);
    if (updatedCustomerGroup) {
      res.status(200).json(updatedCustomerGroup);
    } else {
      res.status(404).json({ message: 'Customer group not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCustomerGroup = async (req, res) => {
  try {
    const deleted = await customerGroupService.deleteCustomerGroup(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'Customer group deleted successfully' });
    } else {
      res.status(404).json({ message: 'Customer group not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCustomerGroup,
  getAllCustomerGroups,
  getCustomerGroupById,
  updateCustomerGroup,
  deleteCustomerGroup,
};