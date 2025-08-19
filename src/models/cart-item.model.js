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
    cart_id: DataTypes.UUID,
    variant_id: DataTypes.UUID,
    // variant sku number
    sku: DataTypes.TEXT,
    // variant title
    variant_title: DataTypes.TEXT,

    // variant price
    unit_price: DataTypes.DECIMAL(12, 5),
    quantity: DataTypes.INTEGER,

    // discounts
    // discount_type: DataTypes.STRING,
    // discount_amount: DataTypes.DECIMAL(12, 5),
    // discount_rule_id: DataTypes.UUID,
    // discount_applied_at: DataTypes.DATE,
    //
    // discount_description: DataTypes.TEXT,
    metadata: DataTypes.JSONB,
    // target_phone_number: DataTypes.STRING,
    // selected_number: DataTypes.STRING,
    // activation_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};
