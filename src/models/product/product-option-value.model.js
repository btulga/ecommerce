'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOptionValue extends Model {
    static associate(models) {
      this.belongsTo(models.ProductOption, { foreignKey: 'option_id', as: 'option' });
      this.belongsToMany(models.ProductVariant, {
        through: models.ProductVariantOption,
        foreignKey: 'product_option_value_id',
        otherKey: 'product_variant_id',
        as: 'variants',
      });
    }
  }
  ProductOptionValue.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    value: DataTypes.TEXT,
    option_id: { type: DataTypes.UUID, allowNull: false },
  }, {
    sequelize,
    modelName: 'ProductOptionValue',
    tableName: 'product_option_values',
    timestamps: true,
    underscored: true,
  });
  return ProductOptionValue;
};
