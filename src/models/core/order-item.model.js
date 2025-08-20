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
    attributes: DataTypes.JSONB, // { color: blue } // snapshot
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    sku: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL(12, 5),
    metadata: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_item',
    timestamps: true,
    underscored: true,
  });
  return OrderItem;
};
