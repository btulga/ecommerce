'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      //
    }
  }
  Discount.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    // discount type
    discount_type: { type: DataTypes.STRING, allowNull: false }, // 'percentage','fixed'
    // discount value
    value: DataTypes.DECIMAL(12, 5),
    // other metadata
    metadata: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Discount',
    tableName: 'discount',
    timestamps: true,
    underscored: true
  });
  return Discount;
};
