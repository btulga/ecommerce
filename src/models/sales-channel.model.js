const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class SalesChannel extends Model {}

  SalesChannel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'SalesChannel',
    tableName: 'sales_channels',
    timestamps: true,
  });

  return SalesChannel;
};
