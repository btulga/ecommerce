'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {}
  Campaign.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    starts_at: DataTypes.DATE,
    ends_at: DataTypes.DATE,
  }, { sequelize, modelName: 'Campaign', tableName: 'campaigns', timestamps: true, underscored: true });
  return Campaign;
};
