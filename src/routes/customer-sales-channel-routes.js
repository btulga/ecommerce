// src/routes/customer-sales-channel-routes.js
const express = require('express');
const Controller = require('../controllers/customer-sales-channel.controller');
const router = express.Router();

// Admin links
router.post('/admin/customers/:customerId/channels/:channelId', Controller.addToChannel);
router.delete('/admin/customers/:customerId/channels/:channelId', Controller.removeFromChannel);
router.put('/admin/customers/:customerId/channels', Controller.setChannelsForCustomer); // body: { channels: [] }

// Readonly
router.get('/customers/:customerId/channels', Controller.listChannelsOfCustomer);
router.get('/sales-channels/:channelId/customers', Controller.listCustomersInChannel);

module.exports = router;
