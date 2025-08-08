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
    material: DataTypes.STRING,
    product_id: {
      type: DataTypes.UUID,
      references: {
        model: 'product', // This should be the table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'ProductVariant',
  });
  return ProductVariant;
};