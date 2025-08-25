'use strict';
const { DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
  class SalesChannel extends Model {
    static associate(models) {
      SalesChannel.hasMany(models.SalesChannelPaymentProvider, {
        foreignKey: 'sales_channel_id',
        as: 'payment_providers'
      });
      SalesChannel.belongsToMany(models.Customer, {
        through: 'customer_sales_channels',
        foreignKey: 'sales_channel_id',
        otherKey: 'customer_id',
        as: 'customers'
      });
      SalesChannel.belongsToMany(models.Product, {
        through: 'product_sales_channel',
        foreignKey: 'sales_channel_id',
        otherKey: 'product_id',
        as: 'products',
      });
    }
  }
  SalesChannel.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    is_disabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    modelName: 'SalesChannel',
    tableName: 'sales_channel',
    timestamps: true,
    underscored: true,
  });
  return SalesChannel;
};
