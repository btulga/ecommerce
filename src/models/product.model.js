'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product has many Variants
      Product.hasMany(models.ProductVariant, {
        foreignKey: 'product_id',
        as: 'variants'
      });

      // Product belongs to one Collection
      Product.belongsTo(models.ProductCollection, {
        foreignKey: 'collection_id',
        as: 'collection'
      });

      // Product has many Tags through a join table
      Product.belongsToMany(models.ProductTag, {
        through: 'product_tags',
        foreignKey: 'product_id',
        as: 'tags'
      });
      
      // Product can be part of many Discount Rules
      Product.belongsToMany(models.DiscountRule, {
        through: 'discount_rule_products',
        foreignKey: 'product_id'
      });

      // Product belongs to one ProductCategory
      Product.belongsTo(models.ProductCategory, {
        foreignKey: 'category_id',
        as: 'category'
      });
    }
  }
  Product.init({
    // Keeping your existing fields
    id: { // Added ID for consistency
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    handle: { // URL friendly string
        type: DataTypes.STRING,
        unique: true
    },
    is_giftcard: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
    },    
    category_id: {
      type: DataTypes.UUID,
      references: {
        model: 'product_categories', // Assuming the table name is 'product_categories'
        key: 'id',
      },
    }, // Added foreign key for product category
    type: DataTypes.STRING // Added field for product type
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  });
  return Product;
};
