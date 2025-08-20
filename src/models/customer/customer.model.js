'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsToMany(models.SalesChannel, {
        through: 'customer_sales_channel',
        foreignKey: 'customer_id',
        otherKey: 'sales_channel_id',
        as: 'sales_channels'
      });
      Customer.belongsToMany(models.CustomerGroup, {
        through: 'customer_group_customer',
        foreignKey: 'customer_id',
        otherKey: 'customer_group_id',
        as: 'customer_groups'
      });

      Customer.hasMany(models.Order, { foreignKey: 'customer_id', as: 'orders' });
      Customer.hasMany(models.Address, { foreignKey: 'customer_id', as: 'addresses' });
    }
  }
  Customer.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: true } },
    phone: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    has_account: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customer',
    timestamps: true,
    underscored: true,
  });
  return Customer;
};
