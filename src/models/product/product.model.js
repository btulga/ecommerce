'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
      Product.hasMany(models.ProductVariant, { foreignKey: 'product_id', as: 'variants' });
      Product.belongsToMany(models.ProductTag, {
        through: 'product_product_tags',
        foreignKey: 'product_id',
        otherKey: 'product_tag_id',
        as: 'tags'
      });
      Product.belongsToMany(models.ProductCollection, {
        through: 'product_collection_products',
        foreignKey: 'product_id',
        otherKey: 'product_collection_id',
        as: 'collections'
      });
    }
  }
  Product.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    thumbnail: DataTypes.STRING,
    category_id: { type: DataTypes.UUID, allowNull: true },
    price: DataTypes.DECIMAL(12,5),
    currency_code: DataTypes.STRING,
    is_giftcard: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.STRING, defaultValue: 'draft' },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    underscored: true,
  });
  return Product;
};
