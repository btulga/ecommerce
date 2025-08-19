'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {}
  Tag.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags',
    timestamps: true,
    underscored: true,
  });
  return Tag;
};
