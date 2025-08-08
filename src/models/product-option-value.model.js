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
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    option_id: {
      type: DataTypes.UUID,
      references: {
        model: 'product_option',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'ProductOptionValue',
    tableName: 'product_option_values',
  });
  return ProductOptionValue;
};