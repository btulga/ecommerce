'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Shipment extends Model {
        static associate(models) {
            Shipment.belongsTo(models.Order, {foreignKey: 'order_id', as: 'order'});
            Shipment.belongsTo(models.ShipmentAddress, {foreignKey: 'shipment_address_id', as: 'shipment_address'});
        }
    }
    Shipment.init({
        id: {type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true},
        order_id: {type: DataTypes.STRING},
        location_id: {type: DataTypes.STRING}, // shipment-ийг аль агуулахаас гаргаж буйг заана
        shipment_address_id: {type: DataTypes.STRING},
        shipment_price: { type: DataTypes.DECIMAL(12, 5) },
        status: {type: DataTypes.STRING, defaultValue: 'pending'}, // pending, shipped, ready_for_pickup, delivered
        carrier: {type: DataTypes.STRING},
        tracking_number: {type: DataTypes.TEXT},
        shipped_at: {type: DataTypes.DATE},
        delivered_at: {type: DataTypes.DATE},
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'order',
        timestamps: true,
        underscored: true,
    });
    return Shipment;
};
