'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscountRule extends Model {
    static associate(models) {
      DiscountRule.belongsToMany(models.Product, { through: models.DiscountRuleProduct, foreignKey: 'discount_rule_id', otherKey: 'product_id', as: 'products' });
      DiscountRule.belongsToMany(models.SalesChannel, { through: models.DiscountRuleSalesChannel, foreignKey: 'discount_rule_id', otherKey: 'sales_channel_id', as: 'sales_channels' });
      DiscountRule.belongsToMany(models.Customer, { through: 'discount_rule_customers', foreignKey: 'discount_rule_id', otherKey: 'customer_id', as: 'customers' });
    }
  }
  DiscountRule.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.ENUM('percentage', 'fixed', 'tiered'), allowNull: false },
    value: { type: DataTypes.DECIMAL(12,5), allowNull: true },
    starts_at: DataTypes.DATE,
    ends_at: DataTypes.DATE,
    usage_limit: DataTypes.INTEGER,
    metadata: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'DiscountRule',
    tableName: 'discount_rules',
    timestamps: true,
    underscored: true,
  });
  return DiscountRule;
};
