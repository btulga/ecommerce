'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {}
  OrderItem.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    order_id: DataTypes.UUID,
    variant_id: DataTypes.UUID,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    sku: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL(12, 5),
    discount_type: DataTypes.STRING,
    discount_amount: DataTypes.DECIMAL(12, 5),
    discount_rule_id: DataTypes.UUID,
    discount_applied_at: DataTypes.DATE,
    metadata: DataTypes.JSONB,
    target_phone_number: DataTypes.STRING,
    selected_number: DataTypes.STRING,
    activation_code: DataTypes.STRING,
    activation_status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true,
    underscored: true,
  });
  return OrderItem;
};
