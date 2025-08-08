'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      // A customer can be eligible for many discount rules
      Customer.belongsToMany(models.DiscountRule, {
        through: 'discount_rule_customers',
        foreignKey: 'customer_id',
        as: 'discount_rules'
      });
      
      // Customer has many Orders
      Customer.hasMany(models.Order, {
        foreignKey: 'customer_id',
        as: 'orders'
      });

      // Customer can have many Addresses (shipping and billing)
      Customer.hasMany(models.Address, {
          foreignKey: 'customer_id',
          as: 'addresses'
      });

      // Customer can belong to many CustomerGroups
      Customer.belongsToMany(models.CustomerGroup, {
        through: 'customer_group_customers',
        foreignKey: 'customer_id',
        as: 'customer_groups'
      });
    }
  }
  Customer.init({
    id: { // Added ID for consistency
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { isEmail: true }
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    has_account: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers'
  });
  return Customer;
};
