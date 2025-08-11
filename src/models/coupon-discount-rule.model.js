'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CouponDiscountRule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CouponDiscountRule.init({
    couponId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'coupons',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    discountRuleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'discount_rules',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'CouponDiscountRule',
    tableName: 'coupon_discount_rules',
  });
  return CouponDiscountRule;
};