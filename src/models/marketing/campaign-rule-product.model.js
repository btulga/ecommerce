'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CampaignRuleProduct extends Model {
    static associate(models) {
      CampaignRuleProduct.belongsTo(models.Campaign, {
        foreignKey: 'campaign_id',
      });
      CampaignRuleProduct.belongsTo(models.Product, {
        foreignKey: 'product_id',
      });
    }
  }
  CampaignRuleProduct.init({
    campaign_id: { type: DataTypes.UUID, primaryKey: true },
    product_id: { type: DataTypes.UUID, primaryKey: true },
  }, {
    sequelize,
    modelName: 'CampaignRuleProduct',
    tableName: 'campaign_rule_product',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['campaign_id', 'product_id'] }]
  });
  return CampaignRuleProduct;
};
