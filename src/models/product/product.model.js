'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // one product belongs to many category
      Product.belongsToMany(models.Category, {
        through: 'product_category',
        foreignKey: 'product_id',
        otherKey: 'category_id',
        as: 'categories'
      });
      Product.belongsToMany(models.Tag, {
        through: 'product_tags',
        foreignKey: 'product_id',
        otherKey: 'tag_id',
        as: 'tags'
      });
      // one product belongs to many collection
      Product.belongsToMany(models.Collection, {
        through: 'product_collection',
        foreignKey: 'product_id',
        otherKey: 'collection_id',
        as: 'collections'
      });
      // one product has many options
      Product.hasMany(models.ProductOption, {
        foreignKey: 'product_id',
        as: 'options',
      });
      // one product has many variants
      Product.hasMany(models.ProductVariant, {
        foreignKey: 'product_id',
        as: 'variants',
      });
    }
  }
  Product.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    handle: DataTypes.TEXT,
    thumbnail: DataTypes.STRING,
    price: DataTypes.DECIMAL(12, 5),
    currency_code: DataTypes.STRING,
    is_giftcard: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.STRING, defaultValue: 'draft' },
    metadata: { type: DataTypes.JSONB }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'product',
    timestamps: true,
    underscored: true,
  });
  return Product;
};
