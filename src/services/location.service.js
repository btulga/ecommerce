// src/services/location.service.js
const db = require('../models');
const { Location, Inventory } = db;

const LocationService = {
    async createLocation({ name, location_type, address }) {
        return await Location.create({ name, location_type, address });
    },

    async getLocationById(id) {
        return await Location.findByPk(id);
    },

    async getAllLocations() {
        return await Location.findAll({ order: [['created_at', 'DESC']] });
    },

    async updateLocation(id, updates) {
        const loc = await Location.findByPk(id);
        if (!loc) throw new Error('Location not found');
        return await loc.update(updates);
    },

    /**
     * force !== true үед тухайн байршил дээр сток байгаа эсэхийг шалгаад устгана
     */
    async deleteLocation(id, { force = false } = {}) {
        const loc = await Location.findByPk(id);
        if (!loc) throw new Error('Location not found');

        if (!force) {
            const count = await Inventory.count({ where: { location_id: id } });
            if (count > 0) {
                throw new Error('Location has inventory. Use force=true or move inventory first.');
            }
        }

        await loc.destroy();
        return true;
    },
};

module.exports = LocationService;
