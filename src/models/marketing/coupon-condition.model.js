'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CouponCondition extends Model {
    static associate(models) {
      CouponCondition.belongsTo(models.Coupon, {
        foreignKey: 'coupon_id',
        as: 'coupon',
      });
    }
  }
  CouponCondition.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    coupon_id: DataTypes.STRING,
    condition_type: DataTypes.STRING, // "min_order_amount", "customer_group", "product_category"
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
  return CouponCondition;
};
