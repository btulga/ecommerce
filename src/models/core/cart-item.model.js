'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
      CartItem.belongsTo(models.ProductVariant, { foreignKey: 'variant_id', as: 'variant' });
    }
  }
  CartItem.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    cart_id: DataTypes.STRING,
    variant_id: DataTypes.STRING,
    sku: DataTypes.TEXT,
    variant_title: DataTypes.TEXT,
    unit_price: DataTypes.DECIMAL(12, 5),
    quantity: DataTypes.INTEGER,
    metadata: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_item',
    timestamps: true,
    underscored: true,
  });
  return CartItem;
};
