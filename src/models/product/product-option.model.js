'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOption extends Model {
    static associate(models) {
      this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
      this.hasMany(models.ProductOptionValue, { foreignKey: 'option_id', as: 'values' });
    }
  }
  ProductOption.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    product_id: { type: DataTypes.UUID, allowNull: false },
  }, {
    sequelize,
    modelName: 'ProductOption',
    tableName: 'product_options',
    timestamps: true,
    underscored: true,
  });
  return ProductOption;
};
