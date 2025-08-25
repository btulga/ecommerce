// src/controllers/location.controller.js
const LocationService = require('../services/location.service');

const LocationController = {
    // --- Admin ---
    async create(req, res) {
        try {
            const loc = await LocationService.createLocation(req.body);
            res.status(201).json(loc);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const loc = await LocationService.updateLocation(id, req.body);
            res.json(loc);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const force = String(req.query.force || '').toLowerCase() === 'true';
            await LocationService.deleteLocation(id, { force });
            res.status(204).send();
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // --- Public ---
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const loc = await LocationService.getLocationById(id);
            if (!loc) return res.status(404).json({ error: 'Location not found' });
            res.json(loc);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async getAll(req, res) {
        try {
            const list = await LocationService.getAllLocations();
            res.json(list);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
};

module.exports = LocationController;
