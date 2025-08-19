'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CampaignRuleCustomerGroup extends Model {
    static associate(models) {
      CampaignRuleCustomerGroup.belongsTo(models.Campaign, {
        foreignKey: 'campaign_id',
      });
      CampaignRuleCustomerGroup.belongsTo(models.CustomerGroup, {
        foreignKey: 'customer_group_id',
      });
    }
  }
  CampaignRuleCustomerGroup.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    campaign_id: DataTypes.UUID,
    customer_group_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'CampaignRuleCustomerGroup',
    tableName: 'campaign_rule_customer_groups',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['campaign_id', 'customer_group_id'] }]
  });
  return CampaignRuleCustomerGroup;
};
