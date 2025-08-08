'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariantOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ProductVariant, {
        foreignKey: 'product_variant_id',
        targetKey: 'id',
        as: 'product_variant'
      });
      this.belongsTo(models.ProductOptionValue, {
        foreignKey: 'product_option_value_id',
        targetKey: 'id',
        as: 'product_option_value'
      });
    }
  }
  ProductVariantOption.init({
    product_variant_id: {
      type: DataTypes.UUID,
      references: {
        model: 'product_variant',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },
    product_option_value_id: {
      type: DataTypes.UUID,
      references: {
        model: 'product_option_value',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'ProductVariantOption',
    tableName: 'product_variant_options',
    timestamps: false, // Join tables often don't need timestamps
  });
  return ProductVariantOption;
};