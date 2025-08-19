'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerDiscountUsage extends Model {
    static associate(models) {
      CustomerDiscountUsage.belongsTo(models.Customer, { foreignKey: 'customer_id' });
      CustomerDiscountUsage.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  CustomerDiscountUsage.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    customer_id: { type: DataTypes.UUID, allowNull: false },
    product_id: { type: DataTypes.UUID, allowNull: false },
    times_used: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    sequelize,
    modelName: 'CustomerDiscountUsage',
    tableName: 'customer_discount_usages',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['customer_id', 'product_id'] }]
  });
  return CustomerDiscountUsage;
};
