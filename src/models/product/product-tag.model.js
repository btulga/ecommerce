'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTag extends Model {}
  ProductTag.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ProductTag',
    tableName: 'product_tags',
    timestamps: true,
    underscored: true,
  });
  return ProductTag;
};
