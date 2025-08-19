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
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    campaign_id: DataTypes.UUID,
    product_id: DataTypes.UUID,
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
