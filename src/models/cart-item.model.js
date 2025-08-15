'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CartItem.init({
    cart_id: DataTypes.STRING,
    order_id: DataTypes.STRING,
    variant_id: DataTypes.STRING,
    sku: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.INTEGER,
    metadata: DataTypes.JSONB,
    target_phone_number: DataTypes.STRING,
    selected_number: DataTypes.STRING,
    activation_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};