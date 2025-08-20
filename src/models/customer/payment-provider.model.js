'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentProvider extends Model {
    static associate(models) {
      PaymentProvider.belongsTo(models.SalesChannel, {
        foreignKey: 'sales_channel_id',
        as: 'sales_channel',
      })
    }
  }
  PaymentProvider.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sales_channel_id: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    provider_id: { type: DataTypes.STRING, allowNull: false }, //qpay, socialpay, etc
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    sequelize,
    modelName: 'PaymentProvider',
    tableName: 'payment_provider',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['sales_channel_id', 'provider_id'] }]
  });
  return PaymentProvider;
};
