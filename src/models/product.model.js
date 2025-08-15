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

      // Product has many Categories through ProductCategory
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: 'product_id'
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
    handle: { // URL friendly string 'unit-top-up', 'data-add-on'
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
    type: DataTypes.STRING, // Added field for product type 'physical', 'digital', 'service'
    price: DataTypes.DECIMAL(10, 2), // Assuming a price field exists
    is_deliverable: { // Added field for quantity limit on discounts
      type: DataTypes.BOOLEAN, // Added field for quantity limit on discounts
      defaultValue: true
    },
    discount_limit: DataTypes.INTEGER, // New field for quantity limit on discounts
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  });
  return Product;
};
