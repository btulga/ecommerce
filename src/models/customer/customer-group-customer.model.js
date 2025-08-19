'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerGroupCustomer extends Model {
    static associate(models) {
      this.belongsTo(models.CustomerGroup, { foreignKey: 'customer_group_id', as: 'customer_group' });
      this.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
    }
  }
  CustomerGroupCustomer.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    customer_group_id: { type: DataTypes.UUID, allowNull: false },
    customer_id: { type: DataTypes.UUID, allowNull: false },
  }, {
    sequelize,
    modelName: 'CustomerGroupCustomer',
    tableName: 'customer_group_customers',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['customer_group_id', 'customer_id'] }]
  });
  return CustomerGroupCustomer;
};
