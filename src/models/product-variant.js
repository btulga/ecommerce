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
      // define association here
    }
  }
  ProductVariant.init({
    title: DataTypes.STRING,
    sku: DataTypes.STRING,
    barcode: DataTypes.STRING,
    ean: DataTypes.STRING,
    upc: DataTypes.STRING,
    inventory_quantity: DataTypes.INTEGER,
    allow_backorder: DataTypes.BOOLEAN,
    manage_inventory: DataTypes.BOOLEAN,
    hs_code: DataTypes.STRING,
    origin_country: DataTypes.STRING,
    mid_code: DataTypes.STRING,
    material: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductVariant',
  });
  return ProductVariant;
};