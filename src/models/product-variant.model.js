'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      this.belongsToMany(models.ProductOptionValue, {
        through: models.ProductVariantOption,
        foreignKey: 'product_variant_id',
        as: 'options', // or values, depending on how you want to name the association
      });
      this.hasMany(models.Inventory, {
        foreignKey: 'variant_id',
        as: 'inventory',
      });
      // define association here
    }
  }
  ProductVariant.init({
    product_id: DataTypes.UUID,
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
  });
  return ProductVariant;
};