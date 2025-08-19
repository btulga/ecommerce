'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    static associate(models) {
      Collection.belongsToMany(models.Product, {
        through: models.ProductCollection,
        foreignKey: 'collection_id',
        otherKey: 'product_id',
        as: 'products',
      });
    }
  }
  Collection.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: DataTypes.STRING,
    // URL slug
    handle: DataTypes.TEXT,
    metadata: DataTypes.JSONB,
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Collection',
    tableName: 'collections',
    timestamps: true,
    underscored: true,
  });
  return Collection;
};
