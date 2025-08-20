'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ShipmentMethodRate extends Model {
        static associate(models) {
        }
    }

    ShipmentMethodRate.init({
        id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true},
        shipment_method_id: {type: DataTypes.STRING},
        min_weight:   { type: DataTypes.DOUBLE }, // kg
        max_weight:   { type: DataTypes.DOUBLE }, // kg
        min_volume:   { type: DataTypes.DOUBLE }, // см³
        max_volume:   { type: DataTypes.DOUBLE }, // см³
        base_price:   { type: DataTypes.DECIMAL(12, 5) },
        price_per_kg: { type: DataTypes.DECIMAL(12, 5) },
        price_per_cm3: { type: DataTypes.DECIMAL(12, 5) },
    }, {
        sequelize,
        modelName: 'ShipmentMethodRate',
        tableName: 'shipment_method_rate',
        timestamps: true,
        underscored: true,
    });
    return ShipmentMethodRate;
};

// sample helper
// function calculateShipmentPrice(methodId, weightKg, length, width, height) {
//     const volume = length * width * height; // cm³
//
//     // shipment_method_rates хүснэгтээс тухайн methodId-д таарах rate сонгоно
//     const rate = findRate(methodId, weightKg, volume);
//
//     if (!rate) throw new Error("No rate found for this shipment");
//
//     let price = rate.base_price;
//
//     if (rate.price_per_kg) {
//         price += weightKg * rate.price_per_kg;
//     }
//
//     if (rate.price_per_cm3) {
//         price += volume * rate.price_per_cm3;
//     }
//
//     return { price, currency: rate.currency };
// }