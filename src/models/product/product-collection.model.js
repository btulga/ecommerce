'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCollection extends Model {}
  ProductCollection.init({
    collection_id: { type: DataTypes.UUID, primaryKey: true },
    product_id: { type: DataTypes.UUID, primaryKey: true },
  }, {
    sequelize,
    modelName: 'ProductCollection',
    tableName: 'product_collections',
    timestamps: true,
    underscored: true,
  });
  return ProductCollection;
};
