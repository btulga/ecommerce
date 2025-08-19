'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTag extends Model {}
  ProductTag.init({
    product_id: { type: DataTypes.UUID, primaryKey: true },
    tag_id: { type: DataTypes.UUID, primaryKey: true },
  }, {
    sequelize,
    modelName: 'ProductTag',
    tableName: 'product_tags',
    timestamps: true,
    underscored: true,
  });
  return ProductTag;
};
