'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
      OrderItem.belongsTo(models.ProductVariant, { foreignKey: 'variant_id', as: 'variant' });
    }
  }
  OrderItem.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    order_id: DataTypes.STRING,
    variant_id: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    sku: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL(12, 5),
    // discount_type: DataTypes.STRING,
    // discount_amount: DataTypes.DECIMAL(12, 5),
    // discount_rule_id: DataTypes.UUID,
    // discount_applied_at: DataTypes.DATE,
    metadata: DataTypes.JSONB,
    // target_phone_number: DataTypes.STRING,
    // selected_number: DataTypes.STRING,
    // activation_code: DataTypes.STRING,
    // activation_status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_item',
    timestamps: true,
    underscored: true,
  });
  return OrderItem;
};
