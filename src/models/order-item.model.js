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
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    is_return: DataTypes.BOOLEAN,
    is_giftcard: DataTypes.BOOLEAN,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.INTEGER,
    order_id: DataTypes.STRING,
    variant_id: DataTypes.STRING,
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