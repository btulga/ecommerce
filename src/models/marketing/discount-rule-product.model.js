'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscountRuleProduct extends Model {}
  DiscountRuleProduct.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    discount_rule_id: DataTypes.UUID,
    product_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'DiscountRuleProduct',
    tableName: 'discount_rule_products',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['discount_rule_id', 'product_id'] }]
  });
  return DiscountRuleProduct;
};
