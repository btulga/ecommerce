'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
      Address.hasMany(models.Order, {
        foreignKey: 'shipping_address_id',
        as: 'shipped_orders'
      });
    }
  }

  Address.init({
    id: { type: DataTypes.STRING,  defaultValue: DataTypes.UUIDV4,  primaryKey: true,  allowNull: false, },
    customer_id: { type: DataTypes.STRING, allowNull: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address_1: DataTypes.TEXT,
    address_2: DataTypes.TEXT,
    city: DataTypes.STRING,
    country_code: DataTypes.STRING,
    province: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    phone: DataTypes.STRING,
    company: DataTypes.TEXT,
    is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'address',
    timestamps: true,
    underscored: true,
  });

  return Address;
};
