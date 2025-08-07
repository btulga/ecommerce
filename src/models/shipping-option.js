'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShippingOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ShippingOption.init({
    name: DataTypes.STRING,
    provider_id: DataTypes.STRING,
    price_type: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    is_return: DataTypes.BOOLEAN,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'ShippingOption',
  });
  return ShippingOption;
};