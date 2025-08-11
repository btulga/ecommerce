const express = require('express');
const router = express.Router();
const customerGroupController = require('../controllers/customer-group.controller');
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

// Add a customer to a customer group
// Create a new customer group
router.post('/', customerGroupController.createCustomerGroup);

// Get a specific customer group by ID
router.get('/:id', customerGroupController.getCustomerGroup);

// Update a customer group by ID
router.put('/:id', customerGroupController.updateCustomerGroup);

// Delete a customer group by ID
router.delete('/:id', customerGroupController.deleteCustomerGroup);

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

// Apply a discount rule to a customer group
router.post('/:id/discount-rules', async (req, res, next) => {
  try {
    const customerGroupId = req.params.id;
    const discountRuleId = req.body.discountRuleId; // Assuming the discount rule ID is sent in the request body

    if (!discountRuleId) {
      return res.status(400).json({ message: 'Discount Rule ID is required' });
    }

    await CustomerGroupService.applyDiscountRuleToGroup(customerGroupId, discountRuleId);
    res.status(200).json({ message: 'Discount rule applied to group successfully' });
  } catch (error) {
    next(error);
  }
});

// Remove a discount rule from a customer group
router.delete('/:id/discount-rules/:discountRuleId', async (req, res, next) => {
  try {
    const customerGroupId = req.params.id;
    const discountRuleId = req.params.discountRuleId;
    await CustomerGroupService.removeDiscountRuleFromGroup(customerGroupId, discountRuleId);
    res.status(200).json({ message: 'Discount rule removed from group successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;