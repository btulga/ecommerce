'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
            Order.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
            Order.belongsTo(models.SalesChannel, { foreignKey: 'sales_channel_id', as: 'sales_channel' });
            Order.belongsTo(models.ShipmentMethod, { foreignKey: 'shipment_method_id', as: 'shipment_method' });

            Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
            Order.hasMany(models.Payment, { foreignKey: 'order_id', as: 'payments' });
        }
    }
    Order.init({
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        cart_id: { type: DataTypes.STRING },
        customer_id: { type: DataTypes.STRING },
        sales_channel_id: { type: DataTypes.STRING },
        shipment_method_id: { type: DataTypes.STRING }, // null on digital product
        number: { type: DataTypes.STRING }, // e.g. ORD-2025-000123
        status: { type: DataTypes.STRING, defaultValue: 'not_paid' }, // 'not_paid','awaiting','authorized','partially_paid','paid','refunded','cancelled'
        // customer info snapshot
        customer_email: { type: DataTypes.STRING }, // snapshot
        customer_phone: { type: DataTypes.STRING }, // snapshot
        // price section
        subtotal: DataTypes.DECIMAL(12,5),
        discount_total: DataTypes.DECIMAL(12,5),
        shipping_total: DataTypes.DECIMAL(12,5),       // 0 on digital or service product
        tax_total: DataTypes.DECIMAL(12,5),
        total: DataTypes.DECIMAL(12,5),
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'order',
        timestamps: true,
        underscored: true,
    });
    return Order;
};
