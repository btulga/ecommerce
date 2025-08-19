'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscountRuleCustomerGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DiscountRuleCustomerGroup.belongsTo(models.DiscountRule, {
        foreignKey: 'discount_rule_id',
      });
      DiscountRuleCustomerGroup.belongsTo(models.CustomerGroup, {
        foreignKey: 'customer_group_id',
      });
    }
  }
  DiscountRuleCustomerGroup.init({
    discount_rule_id: DataTypes.UUID,
    customer_group_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'DiscountRuleCustomerGroup',
    tableName: 'discount_rule_customer_groups',
    underscored: true,
  });
  return DiscountRuleCustomerGroup;
};
