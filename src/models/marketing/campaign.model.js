'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    static associate(models) {
    }
  }
  Campaign.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    // date time
    start_date: DataTypes.DATE,
    end_date: { type: DataTypes.DATE, allowNull: true }, // null value means no end date
    // other metadata
    metadata: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Campaign',
    tableName: 'campaign',
    timestamps: true,
    underscored: true
  });
  return Campaign;
};
