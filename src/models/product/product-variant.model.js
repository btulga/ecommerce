'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
      this.belongsToMany(models.ProductOptionValue, {
        through: models.ProductVariantOption,
        foreignKey: 'product_variant_id',
        otherKey: 'product_option_value_id',
        as: 'options',
      });
      this.hasMany(models.Inventory, { foreignKey: 'variant_id', as: 'inventory' });
    }
  }
  ProductVariant.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_id: { type: DataTypes.UUID, allowNull: false },
    title: DataTypes.STRING,
    sku: DataTypes.TEXT,
    barcode: DataTypes.STRING,
    ean: DataTypes.STRING,
    upc: DataTypes.STRING,
    inventory_quantity: DataTypes.INTEGER,
    allow_backorder: DataTypes.BOOLEAN,
    manage_inventory: DataTypes.BOOLEAN,
    hs_code: DataTypes.STRING,
    origin_country: DataTypes.STRING,
    mid_code: DataTypes.STRING,
    material: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ProductVariant',
    tableName: 'product_variants',
    timestamps: true,
    underscored: true,
  });
  return ProductVariant;
};
