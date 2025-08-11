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
    discount_rule_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'discount_rules',
        key: 'id'
      }
    },
    customer_group_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'customer_groups',
        key: 'id'
      }
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'DiscountRuleCustomerGroup',
    tableName: 'discount_rule_customer_groups',
    underscored: true,
  });
  return DiscountRuleCustomerGroup;
};