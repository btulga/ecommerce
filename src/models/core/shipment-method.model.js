'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ShipmentMethod extends Model {
        static associate(models) {
        }
    }

    ShipmentMethod.init({
        id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true},
        name: { type: DataTypes.TEXT },  // "Pickup at Store", "Home Delivery"
        code: { type: DataTypes.STRING }, // "pickup", "delivery"
        description: { type: DataTypes.TEXT },
        is_active: {type: DataTypes.BOOLEAN},
    }, {
        sequelize,
        modelName: 'ShipmentMethod',
        tableName: 'shipment_method',
        timestamps: true,
        underscored: true,
    });
    return ShipmentMethod;
};
