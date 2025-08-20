'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class ShipmentAddress extends Model {
    static associate(models) {
    }
  }

  ShipmentAddress.init({
    id: { type: DataTypes.STRING,  defaultValue: DataTypes.UUIDV4,  primaryKey: true },
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
    modelName: 'ShipmentAddress',
    tableName: 'shipment_address',
    timestamps: true,
    underscored: true,
  });

  return ShipmentAddress;
};
