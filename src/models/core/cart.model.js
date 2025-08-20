'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'items' });
      Cart.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
      Cart.belongsTo(models.SalesChannel, { foreignKey: 'sales_channel_id', as: 'sales_channel' });
    }
  }
  Cart.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    customer_id: { type: DataTypes.STRING, allowNull: true },
    sales_channel_id: { type: DataTypes.STRING, allowNull: true },
    completed_at: DataTypes.DATE,
    // price
    subtotal: DataTypes.DECIMAL(12, 5), // SUM of all cart item unit_price * quantity
    discount_total: DataTypes.DECIMAL(12, 5), // discount
    shipping_total: DataTypes.DECIMAL(12, 5), // shipping total
    tax_total: DataTypes.DECIMAL(12, 5),      // tax total
    total: DataTypes.DECIMAL(12, 5),    // total = subtotal - discount + shipping_total + tax_total
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'cart',
    timestamps: true,
    underscored: true,
  });
  return Cart;
};
