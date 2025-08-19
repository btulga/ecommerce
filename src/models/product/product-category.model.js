'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {}
  ProductCategory.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_id: DataTypes.UUID,
    category_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'product_categories',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['product_id', 'category_id'] }]
  });
  return ProductCategory;
};
