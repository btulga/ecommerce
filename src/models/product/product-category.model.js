'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {}
  ProductCategory.init({
    product_id: { type: DataTypes.STRING, primaryKey: true },
    category_id: { type: DataTypes.STRING, primaryKey: true },
  }, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'product_category',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['product_id', 'category_id'] }]
  });
  return ProductCategory;
};
