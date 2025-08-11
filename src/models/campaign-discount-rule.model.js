'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CampaignDiscountRule extends Model {
    /**
     * Helper method for defining associations.
     * This model is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CampaignDiscountRule.init({
    campaignId: {
      type: DataTypes.UUID,
      references: {
        model: 'campaigns', // name of the campaign table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    discountRuleId: {
      type: DataTypes.UUID,
      references: {
        model: 'discount_rules', // name of the discount_rules table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'CampaignDiscountRule',
    tableName: 'campaign_discount_rules',
  });
  return CampaignDiscountRule;
};