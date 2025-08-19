'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    static associate(models) {
      Campaign.hasOne(models.Coupon, {
        foreignKey: 'campaign_id',
        as: 'coupon'
      });
      Campaign.belongsToMany(models.Product, {
        through: models.CampaignRuleProduct,
        foreignKey: 'campaign_id',
        otherKey: 'product_id',
        as: 'products'
      });
      Campaign.belongsToMany(models.SalesChannel, {
        through: models.CampaignRuleSalesChannel,
        foreignKey: 'campaign_id',
        otherKey: 'sales_channel_id',
        as: 'sales_channels'
      });
      Campaign.belongsToMany(models.CustomerGroup, {
        through: models.CampaignRuleCustomerGroup,
        foreignKey: 'campaign_id',
        otherKey: 'customer_group_id',
        as: 'customer_groups'
      });
    }
  }
  Campaign.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    // campaign code
    campaign_code: { type: DataTypes.STRING, allowNull: false, unique: true },
    // coupon code not null is coupon only campaign
    coupon_code: { type: DataTypes.STRING, allowNull: false, unique: true },
    // discount type
    type: { type: DataTypes.STRING, allowNull: false }, // percentage, fixed
    value: { type: DataTypes.DECIMAL(12,5), allowNull: true },
    // date time
    start_at: DataTypes.DATE,
    end_at: { type: DataTypes.DATE, allowNull: true }, // null value means no end date
    // usage limit
    usage_limit: { type: DataTypes.INTEGER, defaultValue: 0},
    // other metadata
    metadata: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Campaign',
    tableName: 'campaigns',
    timestamps: true,
    underscored: true
  });
  return Campaign;
};
