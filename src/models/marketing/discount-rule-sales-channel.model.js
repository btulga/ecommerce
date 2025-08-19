'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscountRuleSalesChannel extends Model {}
  DiscountRuleSalesChannel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    discount_rule_id: DataTypes.UUID,
    sales_channel_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'DiscountRuleSalesChannel',
    tableName: 'discount_rule_sales_channels',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['discount_rule_id', 'sales_channel_id'] }]
  });
  return DiscountRuleSalesChannel;
};
