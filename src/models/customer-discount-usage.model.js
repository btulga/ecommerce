'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CustomerDiscountUsage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CustomerDiscountUsage.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
      });
      CustomerDiscountUsage.belongsTo(models.Product, {
        foreignKey: 'product_id',
      });
    }
  }
  CustomerDiscountUsage.init({
    customer_id: {
      type: DataTypes.UUID,
      references: {
        model: 'customers',
        key: 'id',
      },
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      references: {
        model: 'products',
        key: 'id',
      },
      allowNull: false,
      primaryKey: true,
    },
    times_used: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'CustomerDiscountUsage',
    tableName: 'customer_discount_usages',
    timestamps: true,
  });
  return CustomerDiscountUsage;
};