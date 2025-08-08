const express = require('express');
const router = express.Router();
const CustomerGroupService = require('../services/customer-group.service'); // Assuming the service file is in ../services

// Get all customer groups
router.get('/', async (req, res, next) => {
  try {
    const customerGroups = await CustomerGroupService.findAllCustomerGroups();
    res.json(customerGroups);
  } catch (error) {
    next(error);
  }
});

// Get a single customer group by ID
router.get('/:id', async (req, res, next) => {
  try {
    const customerGroup = await CustomerGroupService.findCustomerGroupById(req.params.id);
    if (!customerGroup) {
      return res.status(404).json({ message: 'Customer group not found' });
    }
    res.json(customerGroup);
  } catch (error) {
    next(error);
  }
});

// Create a new customer group
router.post('/', async (req, res, next) => {
  try {
    const newCustomerGroup = await CustomerGroupService.createCustomerGroup(req.body);
    res.status(201).json(newCustomerGroup);
  } catch (error) {
    next(error);
  }
});

// Update a customer group by ID
router.put('/:id', async (req, res, next) => {
  try {
    const updatedCustomerGroup = await CustomerGroupService.updateCustomerGroup(req.params.id, req.body);
    if (!updatedCustomerGroup) {
      return res.status(404).json({ message: 'Customer group not found' });
    }
    res.json(updatedCustomerGroup);
  } catch (error) {
    next(error);
  }
});

// Delete a customer group by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await CustomerGroupService.deleteCustomerGroup(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Customer group not found' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Add a customer to a customer group
router.post('/:id/customers', async (req, res, next) => {
  try {
    const customerGroupId = req.params.id;
    const customerId = req.body.customerId; // Assuming the customer ID is sent in the request body

    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    await CustomerGroupService.addCustomerToGroup(customerGroupId, customerId);
    res.status(200).json({ message: 'Customer added to group successfully' });
  } catch (error) {
    next(error);
  }
});

// Remove a customer from a customer group
router.delete('/:id/customers/:customerId', async (req, res, next) => {
  try {
    const customerGroupId = req.params.id;
    const customerId = req.params.customerId;

    await CustomerGroupService.removeCustomerFromGroup(customerGroupId, customerId);
    res.status(200).json({ message: 'Customer removed from group successfully' });
  } catch (error) {
    next(error);
  }
});


module.exports = router;