// src/controllers/inventory.controller.js
const InventoryService = require('../services/inventory.service');

const InventoryController = {
    // --- Admin (stock operations) ---
    async createOrSet(req, res) {
        try {
            const row = await InventoryService.createInventory(req.body);
            res.status(201).json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async setQuantity(req, res) {
        try {
            const row = await InventoryService.setQuantity(req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async adjustQuantity(req, res) {
        try {
            const row = await InventoryService.adjustQuantity(req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async reserve(req, res) {
        try {
            const row = await InventoryService.reserve(req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async releaseReservation(req, res) {
        try {
            const row = await InventoryService.releaseReservation(req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async commitReservationToSale(req, res) {
        try {
            const row = await InventoryService.commitReservationToSale(req.body);
            res.json(row);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async transfer(req, res) {
        try {
            const info = await InventoryService.transfer(req.body);
            res.json(info);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    // --- Public (reads) ---
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const row = await InventoryService.getInventoryById(id);
            if (!row) return res.status(404).json({ error: 'Inventory not found' });
            res.json(row);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async byVariant(req, res) {
        try {
            const { variantId } = req.params;
            const rows = await InventoryService.getByVariant(variantId);
            res.json(rows);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async byLocation(req, res) {
        try {
            const { locationId } = req.params;
            const rows = await InventoryService.getByLocation(locationId);
            res.json(rows);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },

    async availability(req, res) {
        try {
            const { variantId } = req.params;
            const a = await InventoryService.getAvailability(variantId);
            res.json(a);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
};

module.exports = InventoryController;
