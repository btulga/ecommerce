'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariantOptionValue extends Model {
    static associate(models) {
      this.belongsTo(models.ProductVariant, { foreignKey: 'product_variant_id', as: 'product_variant' });
      this.belongsTo(models.ProductOptionValue, { foreignKey: 'product_option_value_id', as: 'product_option_value' });
    }
  }
  ProductVariantOptionValue.init({
    product_variant_id: { type: DataTypes.STRING, primaryKey: true },
    product_option_value_id: { type: DataTypes.STRING, primaryKey: true },
  }, {
    sequelize,
    modelName: 'ProductVariantOptionValue',
    tableName: 'product_variant_option_value',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['product_variant_id', 'product_option_value_id'] }]
  });
  return ProductVariantOptionValue;
};
