'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesChannelPaymentProvider extends Model {
    static associate(models) {
      SalesChannelPaymentProvider.belongsTo(models.SalesChannel, {
        foreignKey: 'sales_channel_id',
        as: 'sales_channel',
      })
    }
  }
  SalesChannelPaymentProvider.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sales_channel_id: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    payment_provider_id: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'SalesChannelPaymentProvider',
    tableName: 'sales_channel_payment_provider',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['sales_channel_id', 'payment_provider_id'] }]
  });
  return SalesChannelPaymentProvider;
};
