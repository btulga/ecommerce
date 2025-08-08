const { Model } = require('sequelize');

// This is a join table model, so it doesn't need its own columns.
// It's defined to help Sequelize manage the many-to-many relationship
// between DiscountRule and Product.
module.exports = (sequelize) => {
  class DiscountRuleProduct extends Model {}
  DiscountRuleProduct.init({
    discount_rule_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'DiscountRule', // This is the model name, not the table name
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Product', // This is the model name, not the table name
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'DiscountRuleProduct',
    tableName: 'discount_rule_products',
  });
  return DiscountRuleProduct;
};
