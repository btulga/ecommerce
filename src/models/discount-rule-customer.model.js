'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscountRuleCustomer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.DiscountRule, {
        foreignKey: 'discount_rule_id',
        targetKey: 'id',
        as: 'discount_rule'
      });
      this.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        targetKey: 'id',
        as: 'customer'
      });
    }
  }
  DiscountRuleCustomer.init({
    discount_rule_id: {
      type: DataTypes.UUID,
      references: {
        model: 'discount_rule',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    customer_id: {
      type: DataTypes.UUID,
      references: {
        model: 'customer',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'DiscountRuleCustomer',
    tableName: 'discount_rule_customers',
  });
  return DiscountRuleCustomer;
};
