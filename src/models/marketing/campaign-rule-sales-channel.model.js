'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CampaignRuleSalesChannel extends Model {
    static associate(models) {
      CampaignRuleSalesChannel.belongsTo(models.Campaign, {
        foreignKey: 'campaign_id',
      });
      CampaignRuleSalesChannel.belongsTo(models.SalesChannel, {
        foreignKey: 'sales_channel_id',
      });
    }
  }
  CampaignRuleSalesChannel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    campaign_id: DataTypes.UUID,
    sales_channel_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'CampaignRuleSalesChannel',
    tableName: 'campaign_rule_sales_channels',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['campaign_id', 'sales_channel_id'] }]
  });
  return CampaignRuleSalesChannel;
};
