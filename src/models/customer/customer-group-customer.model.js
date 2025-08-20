'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerGroupCustomer extends Model {
    static associate(models) {
      this.belongsTo(models.CustomerGroup, {
        foreignKey: 'customer_group_id',
        as: 'customer_group'
      });
      this.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
    }
  }
  CustomerGroupCustomer.init({
    customer_group_id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    customer_id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  }, {
    sequelize,
    modelName: 'CustomerGroupCustomer',
    tableName: 'customer_group_customer',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['customer_group_id', 'customer_id'] }]
  });
  return CustomerGroupCustomer;
};
