'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Order belongs to a Customer
      Order.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });

      // Order has many OrderItems
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'items'
      });
      
      // Order has one shipping Address
      Order.belongsTo(models.Address, {
          foreignKey: 'shipping_address_id',
          as: 'shipping_address'
      });

      // Order has one Payment
      Order.hasOne(models.Payment, {
          foreignKey: 'order_id',
          as: 'payment'
      });

      // Order belongs to one Cart
      Order.belongsTo(models.Cart, {
          foreignKey: 'cart_id',
          as: 'cart'
      });
    }
  }
  Order.init({
    id: { // Added ID for consistency
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'archived', 'canceled'),
        defaultValue: 'pending'
    },
    fulfillment_status: {
        type: DataTypes.ENUM('not_fulfilled', 'partially_fulfilled', 'fulfilled', 'shipped'),
        defaultValue: 'not_fulfilled'
    },
    payment_status: {
        type: DataTypes.ENUM('not_paid', 'awaiting', 'captured', 'refunded'),
        defaultValue: 'not_paid'
    },
    display_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    customer_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    shipping_address_id: DataTypes.UUID,
    currency_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    cart_id: DataTypes.UUID,
    // 
    discount_total: DataTypes.DECIMAL(12,5),
    shipping_total: DataTypes.DECIMAL(12,5),
    tax_total: DataTypes.DECIMAL(12,5),
    total: DataTypes.DECIMAL(12,5), // (subtotal - discount_total + shipping_total + tax_total) stored,
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders'
  });
  return Order;
};
