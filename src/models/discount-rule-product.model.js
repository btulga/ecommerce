const { Model } = require('sequelize');

// This is a join table model, so it doesn't need its own columns.
// It's defined to help Sequelize manage the many-to-many relationship
// between DiscountRule and Product.
module.exports = (sequelize) => {
  class DiscountRuleProduct extends Model {
    static associate(models) {
      // TODO add associate
    }
  }
  DiscountRuleProduct.init({
    discount_rule_id: DataTypes.UUID,
    product_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'DiscountRuleProduct',
    tableName: 'discount_rule_products',
  });
  return DiscountRuleProduct;
};
