'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsToMany(models.DiscountRule, {
        through: 'discount_rule_customers',
        foreignKey: 'customer_id',
        otherKey: 'discount_rule_id',
        as: 'discount_rules'
      });
      Customer.belongsToMany(models.SalesChannel, {
        through: 'customer_sales_channels',
        foreignKey: 'customer_id',
        otherKey: 'sales_channel_id',
        as: 'sales_channels'
      });
      Customer.hasMany(models.Order, { foreignKey: 'customer_id', as: 'orders' });
      Customer.hasMany(models.Address, { foreignKey: 'customer_id', as: 'addresses' });
      Customer.belongsToMany(models.CustomerGroup, {
        through: 'customer_group_customers',
        foreignKey: 'customer_id',
        otherKey: 'customer_group_id',
        as: 'customer_groups'
      });
    }
  }
  Customer.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: true } },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    has_account: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
    underscored: true,
  });
  return Customer;
};
