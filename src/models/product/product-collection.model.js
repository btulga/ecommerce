'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCollection extends Model {}
  ProductCollection.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: DataTypes.STRING,
    handle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductCollection',
    tableName: 'product_collections',
    timestamps: true,
    underscored: true,
  });
  return ProductCollection;
};
