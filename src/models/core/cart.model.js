'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'items' });
      Cart.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
    }
  }
  Cart.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    customer_id: { type: DataTypes.UUID, allowNull: true },
    region_id: { type: DataTypes.UUID, allowNull: true },
    currency_code: DataTypes.STRING,
    completed_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
    underscored: true,
  });
  return Cart;
};
