'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariantOption extends Model {
    static associate(models) {
      this.belongsTo(models.ProductVariant, { foreignKey: 'product_variant_id', as: 'product_variant' });
      this.belongsTo(models.ProductOptionValue, { foreignKey: 'product_option_value_id', as: 'product_option_value' });
    }
  }
  ProductVariantOption.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_variant_id: { type: DataTypes.UUID, allowNull: false },
    product_option_value_id: { type: DataTypes.UUID, allowNull: false },
  }, {
    sequelize,
    modelName: 'ProductVariantOption',
    tableName: 'product_variant_options',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['product_variant_id', 'product_option_value_id'] }]
  });
  return ProductVariantOption;
};
