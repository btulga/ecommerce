'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PromotionCondition extends Model {
    static associate(models) {
      PromotionCondition.belongsTo(models.Promotion, {
        foreignKey: 'promotion_id',
        as: 'promotion',
      });

    }
  }
  PromotionCondition.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    promotion_id: DataTypes.STRING,
    condition_type: DataTypes.STRING, // "min_order_amount", "customer_group", "category"
    condition_value: DataTypes.STRING,
    operator: DataTypes.STRING, //
    // other metadata
    metadata: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'PromotionCondition',
    tableName: 'promotion_condition',
    timestamps: true,
    underscored: true
  });
  return PromotionCondition;
};
