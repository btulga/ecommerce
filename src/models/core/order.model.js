'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
            Order.belongsTo(models.Address, { foreignKey: 'shipping_address_id', as: 'shipping_address' });
            Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
            Order.hasMany(models.Payment, { foreignKey: 'order_id', as: 'payments' });
        }
    }
    Order.init({
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        status: { type: DataTypes.ENUM('not_paid','awaiting','authorized','partially_paid','paid','refunded','cancelled'), defaultValue: 'not_paid' },
        display_id: { type: DataTypes.INTEGER, autoIncrement: true },
        customer_id: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
        shipping_address_id: { type: DataTypes.STRING },
        currency_code: { type: DataTypes.STRING, allowNull: false },
        draft: { type: DataTypes.BOOLEAN, defaultValue: false },
        cart_id: { type: DataTypes.STRING },
        discount_total: DataTypes.DECIMAL(12,5),
        shipping_total: DataTypes.DECIMAL(12,5),
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
