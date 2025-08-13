'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class SalesChannelPaymentProvider extends Model {
    static associate(models) {
      // define association here
      // No explicit associations needed for a simple join table in this model itself
    }
  }
  SalesChannelPaymentProvider.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    sales_channel_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sales_channels', // Make sure this matches the actual table name for your SalesChannel model
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    payment_provider_id: {
      type: DataTypes.STRING, // Assuming payment provider IDs are strings (e.g., 'qpay', 'stripe')
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'SalesChannelPaymentProvider',
    tableName: 'sales_channel_payment_providers',
    underscored: true,
    timestamps: false, // Timestamps are defined manually
  });
  return SalesChannelPaymentProvider;
};