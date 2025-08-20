'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,
        foreignKey: 'category_id',
        otherKey: 'product_id',
        as: 'products',
      });
      Category.belongsTo(models.Category, {
        foreignKey: 'parent_id',
        as: 'parent',
      });
      Category.hasMany(models.Category, {
        foreignKey: 'parent_id',
        as: 'children',
      });
    }
  }
  Category.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    // URL slug
    handle: DataTypes.TEXT,
    // parent id
    parent_id: DataTypes.STRING,
    // order id
    rank: DataTypes.NUMBER,
    // product category is active.
    is_active: DataTypes.BOOLEAN,
    // category is internal. This can be used to only show the product category to admins and hide it from customers.
    is_internal: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'category',
    timestamps: true,
    underscored: true,
  });
  return Category;
};
