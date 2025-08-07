const { Model } = require('sequelize');

// This is a join table model, so it doesn't need its own columns.
// It's defined to help Sequelize manage the many-to-many relationship
// between DiscountRule and Product.
module.exports = (sequelize) => {
  class DiscountRuleProduct extends Model {}

  DiscountRuleProduct.init({}, {
    sequelize,
    modelName: 'DiscountRuleProduct',
    tableName: 'discount_rule_products',
    timestamps: false, // Join tables usually don't need timestamps
  });

  return DiscountRuleProduct;
};
