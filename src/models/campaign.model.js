'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Campaign.belongsToMany(models.DiscountRule, { 
        through: 'CampaignDiscountRule', 
        foreignKey: 'campaignId', 
        as : 'rules' 
      });
    }
  }
  Campaign.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    starts_at: DataTypes.DATE,
    ends_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Campaign',
  });
  return Campaign;
};