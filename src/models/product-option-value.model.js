'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOptionValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ProductOption, {
        foreignKey: 'option_id',
        as: 'option'
      });
    }
  }
  ProductOptionValue.init({
    value: DataTypes.TEXT,
    option_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'ProductOptionValue',
    tableName: 'product_option_values',
  });
  return ProductOptionValue;
};
