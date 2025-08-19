'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Address extends Model {
    static associate(models) {
      // Address belongs to a Customer
      Address.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });

      // An address can be a shipping address for an Order
      Address.hasMany(models.Order, {
        foreignKey: 'shipping_address_id',
        as: 'shipped_orders'
      });
    }
  }

  Address.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    customer_id: DataTypes.UUID,
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
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: true,
  });

  return Address;
};
