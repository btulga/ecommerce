// src/services/inventory.service.js
const db = require('../models');
const { Sequelize } = db;
const { Inventory, ProductVariant, Location, sequelize } = db;

function available({ quantity = 0, reserved = 0 }) {
    return Math.max(0, Number(quantity) - Number(reserved));
}

const InventoryService = {
    /**
     * variant + location-ийн мөрийг олж ирэх (байхгүй бол үүсгэх)
     */
    async _getOrCreate({ variant_id, location_id }, { transaction } = {}) {
        let row = await Inventory.findOne({ where: { variant_id, location_id }, transaction });
        if (!row) {
            row = await Inventory.create(
                { variant_id, location_id, quantity: 0, reserved: 0 },
                { transaction }
            );
        }
        return row;
    },

    async createInventory({ variant_id, location_id, quantity = 0, reserved = 0 }) {
        // unique (variant_id, location_id) тул давхардлыг зөөлөн барина
        const [row, created] = await Inventory.findOrCreate({
            where: { variant_id, location_id },
            defaults: { quantity, reserved },
        });
        if (!created) {
            await row.update({ quantity, reserved });
        }
        return row;
    },

    async getInventoryById(id) {
        return await Inventory.findByPk(id, {
            include: [
                { model: ProductVariant, as: 'variant' },
                { model: Location, as: 'location' },
            ],
        });
    },

    async getByVariant(variant_id) {
        return await Inventory.findAll({
            where: { variant_id },
            include: [{ model: Location, as: 'location' }],
            order: [['created_at', 'DESC']],
        });
    },

    async getByLocation(location_id) {
        return await Inventory.findAll({
            where: { location_id },
            include: [{ model: ProductVariant, as: 'variant' }],
            order: [['created_at', 'DESC']],
        });
    },

    async getAvailability(variant_id) {
        const rows = await Inventory.findAll({ where: { variant_id } });
        const totals = rows.reduce(
            (acc, r) => {
                acc.quantity += Number(r.quantity || 0);
                acc.reserved += Number(r.reserved || 0);
                return acc;
            },
            { quantity: 0, reserved: 0 }
        );
        return { ...totals, available: available(totals) };
    },

    async setQuantity({ variant_id, location_id, quantity }) {
        return await sequelize.transaction(async (t) => {
            const row = await this._getOrCreate({ variant_id, location_id }, { transaction: t });
            if (quantity < row.reserved) {
                throw new Error('New quantity cannot be less than reserved amount');
            }
            await row.update({ quantity }, { transaction: t });
            return row;
        });
    },

    async adjustQuantity({ variant_id, location_id, delta }) {
        return await sequelize.transaction(async (t) => {
            const row = await this._getOrCreate({ variant_id, location_id }, { transaction: t });
            const newQty = Number(row.quantity) + Number(delta);
            if (newQty < row.reserved) {
                throw new Error('Adjusted quantity would be less than reserved');
            }
            await row.update({ quantity: newQty }, { transaction: t });
            return row;
        });
    },

    /**
     * Карт/заказ дээр түр хадгалах үед
     */
    async reserve({ variant_id, location_id, qty }) {
        if (qty <= 0) throw new Error('qty must be > 0');
        return await sequelize.transaction(async (t) => {
            const row = await this._getOrCreate({ variant_id, location_id }, { transaction: t });
            if (available(row) < qty) {
                throw new Error('Not enough available stock to reserve');
            }
            await row.update(
                { reserved: Sequelize.literal(`"reserved" + ${Number(qty)}`) },
                { transaction: t }
            );
            return row.reload({ transaction: t });
        });
    },

    /**
     * Захиалга цуцлах/карт арилгах үед
     */
    async releaseReservation({ variant_id, location_id, qty }) {
        if (qty <= 0) throw new Error('qty must be > 0');
        return await sequelize.transaction(async (t) => {
            const row = await this._getOrCreate({ variant_id, location_id }, { transaction: t });
            const newReserved = Number(row.reserved) - Number(qty);
            if (newReserved < 0) throw new Error('Reservation to release exceeds reserved');
            await row.update({ reserved: newReserved }, { transaction: t });
            return row;
        });
    },

    /**
     * Төлбөр амжилттай болсны дараа:
     *   quantity -= qty, reserved -= qty
     */
    async commitReservationToSale({ variant_id, location_id, qty }) {
        if (qty <= 0) throw new Error('qty must be > 0');
        return await sequelize.transaction(async (t) => {
            const row = await this._getOrCreate({ variant_id, location_id }, { transaction: t });

            if (row.reserved < qty) throw new Error('Reserved is less than qty to commit');
            if (row.quantity < qty) throw new Error('Quantity is less than qty to commit');

            await row.update(
                {
                    quantity: Sequelize.literal(`"quantity" - ${Number(qty)}`),
                    reserved: Sequelize.literal(`"reserved" - ${Number(qty)}`),
                },
                { transaction: t }
            );
            return row.reload({ transaction: t });
        });
    },

    /**
     * Байршил хооронд шилжүүлэх
     * from: quantity -= qty
     * to:   quantity += qty
     * reserved-ийг оролцуулахгүй (warehousing level)
     */
    async transfer({ variant_id, from_location_id, to_location_id, qty }) {
        if (qty <= 0) throw new Error('qty must be > 0');
        if (from_location_id === to_location_id) throw new Error('Locations are the same');

        return await sequelize.transaction(async (t) => {
            const from = await this._getOrCreate(
                { variant_id, location_id: from_location_id },
                { transaction: t }
            );
            if (available(from) < qty) {
                // шилжүүлэх үед зарим системд available биш quantity-оос шалгадаг.
                // Хэрэв таны дүрэм quantity-оос цэвэр хасах бол row.quantity < qty гэж шалгаарай.
                throw new Error('Not enough available stock at source location');
            }

            const to = await this._getOrCreate(
                { variant_id, location_id: to_location_id },
                { transaction: t }
            );

            await from.update(
                { quantity: Sequelize.literal(`"quantity" - ${Number(qty)}`) },
                { transaction: t }
            );
            await to.update(
                { quantity: Sequelize.literal(`"quantity" + ${Number(qty)}`) },
                { transaction: t }
            );

            return {
                from: await from.reload({ transaction: t }),
                to: await to.reload({ transaction: t }),
            };
        });
    },
};

module.exports = InventoryService;
