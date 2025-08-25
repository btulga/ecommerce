// src/routes/location-routes.js
const express = require('express');
const LocationController = require('../controllers/location.controller');
const router = express.Router();

// --- Admin ---
router.post('/admin/locations', LocationController.create);
router.put('/admin/locations/:id', LocationController.update);
router.delete('/admin/locations/:id', LocationController.remove);

// --- Public ---
router.get('/locations', LocationController.getAll);
router.get('/locations/:id', LocationController.getOne);

module.exports = router;
