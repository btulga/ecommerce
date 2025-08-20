'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      this.belongsToMany(models.ProductOptionValue, {
        through: 'product_variant_option_values',
        foreignKey: 'product_variant_id',
        otherKey: 'product_option_value_id',
        as: 'option_values',
      });
      this.hasMany(models.Inventory, {
        foreignKey: 'variant_id',
        as: 'inventory'
      });
    }
  }
  ProductVariant.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_id: { type: DataTypes.STRING, allowNull: false },
    title: DataTypes.TEXT,
    // The SKU of the product variant.
    sku: DataTypes.TEXT,
    // The barcode of the product variant.
    barcode: DataTypes.STRING,
    // The EAN of the product variant.
    ean: DataTypes.STRING,
    // The UPC of the product variant.
    upc: DataTypes.STRING,
    // Whether the product variant can be ordered when it's out of stock.
    allow_backorder: DataTypes.BOOLEAN,
    // Whether the product variant's inventory should be managed by the core system.
    manage_inventory: DataTypes.BOOLEAN,
    // Whether the product variant's requires shipping.
    requires_shipping: DataTypes.BOOLEAN,
    // sortable
    variant_rank: DataTypes.DOUBLE,
    // dimesion and weight
    weight: DataTypes.DOUBLE,
    length: DataTypes.DOUBLE,
    height: DataTypes.DOUBLE,
    width: DataTypes.DOUBLE,
    // metadata
    metadata: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'ProductVariant',
    tableName: 'product_variant',
    timestamps: true,
    underscored: true,
  });
  return ProductVariant;
};
