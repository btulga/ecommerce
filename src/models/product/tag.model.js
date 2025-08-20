'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {}
  Tag.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'tag',
    timestamps: true,
    underscored: true,
  });
  return Tag;
};
