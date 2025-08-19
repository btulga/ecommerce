'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesChannelPaymentProvider extends Model {}
  SalesChannelPaymentProvider.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sales_channel_id: { type: DataTypes.UUID, allowNull: false },
    payment_provider_id: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'SalesChannelPaymentProvider',
    tableName: 'sales_channel_payment_providers',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['sales_channel_id', 'payment_provider_id'] }]
  });
  return SalesChannelPaymentProvider;
};
