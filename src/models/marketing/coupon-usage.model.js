'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CouponUsage extends Model {
    static associate(models) {
      CouponUsage.belongsTo(models.Coupon, { foreignKey: 'coupon_id', as: 'coupon' });
      CouponUsage.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    }
  }
  CouponUsage.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    coupon_id: { type: DataTypes.STRING },
    customer_id: { type: DataTypes.STRING },
    used_count: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, {
    sequelize,
    modelName: 'CouponUsage',
    tableName: 'coupon_usage',
    timestamps: true,
    underscored: true
  });
  return CouponUsage;
};
