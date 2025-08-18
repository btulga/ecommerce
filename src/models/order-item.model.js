'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderItem.init({
    order_id: DataTypes.UUID,
    variant_id: DataTypes.UUID,
    
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    // thumbnail: DataTypes.STRING,
    // is_return: DataTypes.BOOLEAN,
    // is_giftcard: DataTypes.BOOLEAN,
    sku: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL(12, 5),
    // discounts
    discount_type: DataTypes.STRING,
    discount_amount: DataTypes.DECIMAL(12, 5),
    discount_rule_id: DataTypes.UUID,
    discount_applied_at: DataTypes.DATE,
    // metadata
    metadata: DataTypes.JSONB,

    target_phone_number: DataTypes.STRING,
    selected_number: DataTypes.STRING,
    activation_code: DataTypes.STRING,
    activation_status: DataTypes.STRING // 'pending', 'activated', 'activate_later'
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};