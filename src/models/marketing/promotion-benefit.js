'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PromotionBenefit extends Model {
        static associate(models) {
            PromotionBenefit.belongsTo(models, {
                foreignKey: 'promotion_id',
                as: 'promotion',
            })
        }
    }
    PromotionBenefit.init({
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        promotion_id: DataTypes.STRING,
        benefit_type: DataTypes.STRING, // "coupon" | "discount" | "free_product" | "free_shipping"
        // benefit_type = coupon ued coupon.id, benefit_type = discount uyed discount.id, benefit_type = gift - product_id
        benefit_value: DataTypes.STRING, // free_shipping uyed min_price_amount хангах yostoi
        // other metadata
        metadata: DataTypes.JSONB,
    }, {
        sequelize,
        modelName: 'PromotionBenefit',
        tableName: 'promotion_benefit',
        timestamps: true,
        underscored: true
    });
    return PromotionBenefit;
};
