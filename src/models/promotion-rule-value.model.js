'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PromotionRuleValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PromotionRuleValue.belongsTo(models.PromotionRule, {
        foreignKey: 'promotionRuleId',
        onDelete: 'CASCADE',
      });
    }
  }
  PromotionRuleValue.init({
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'PromotionRuleValue',
  });
  return PromotionRuleValue;
};