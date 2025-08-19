'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CampaignCustomerUsage extends Model {
    static associate(models) {
      CampaignCustomerUsage.belongsTo(models.Campaign, { foreignKey: 'campaign_id' });
      CampaignCustomerUsage.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    }
  }
  CampaignCustomerUsage.init({
    campaign_id: { type: DataTypes.UUID, primaryKey: true },
    customer_id: { type: DataTypes.UUID, primaryKey: true },
    times_used: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  }, {
    sequelize,
    modelName: 'CampaignCustomerUsage',
    tableName: 'campaign_usage',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['campaign_id', 'customer_id'] }]
  });
  return CampaignCustomerUsage;
};
