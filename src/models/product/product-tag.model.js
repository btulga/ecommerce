'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTag extends Model {}
  ProductTag.init({
    product_id: { type: DataTypes.STRING, primaryKey: true },
    tag_id: { type: DataTypes.STRING, primaryKey: true },
  }, {
    sequelize,
    modelName: 'ProductTag',
    tableName: 'product_tag',
    timestamps: true,
    underscored: true,
  });
  return ProductTag;
};
