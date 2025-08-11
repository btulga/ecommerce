'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PromotionRule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Promotion, {
        foreignKey: 'promotionId',
        as: 'promotion'
      });
      this.hasMany(models.PromotionRuleValue, {
        foreignKey: 'promotionRuleId',
        as: 'values'
      });
    }
  }
  PromotionRule.init({
    type: DataTypes.STRING,
    condition: DataTypes.JSON,
    configuration: DataTypes.JSON,
    promotionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PromotionRule',
  });
  return PromotionRule;
};