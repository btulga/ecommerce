'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CouponBenefit extends Model {
        static associate(models) {
            CouponBenefit.belongsTo(models, {
                foreignKey: 'coupon_id',
                as: 'coupon',
            })
        }
    }
    CouponBenefit.init({
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        coupon_id: DataTypes.STRING,
        benefit_type: DataTypes.STRING, // "coupon" | "discount" | "free_product" | "free_shipping"
        // benefit_type = coupon ued coupon.id, benefit_type = discount uyed discount.id, benefit_type = gift - product_id
        benefit_value: DataTypes.STRING, // free_shipping uyed min_price_amount хангах yostoi
        // other metadata
        metadata: DataTypes.JSONB,
    }, {
        sequelize,
        modelName: 'CouponBenefit',
        tableName: 'coupon_benefit',
        timestamps: true,
        underscored: true
    });
    return CouponBenefit;
};
