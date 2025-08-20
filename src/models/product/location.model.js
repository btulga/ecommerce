'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {}
  Location.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: DataTypes.TEXT,
    location_type: DataTypes.STRING, // warehouse, store, pickup_point
    address: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Location',
    tableName: 'location',
    timestamps: true,
    underscored: true,
  });
  return Location;
};
