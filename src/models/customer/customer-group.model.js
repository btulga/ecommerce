'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerGroup extends Model {
    static associate(models) {
      CustomerGroup.belongsToMany(models.Customer, {
        through: models.CustomerGroupCustomer,
        foreignKey: 'customer_group_id',
        otherKey: 'customer_id',
        as: 'customers',
      });
    }
  }
  CustomerGroup.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  }, {
    sequelize,
    modelName: 'CustomerGroup',
    tableName: 'customer_group',
    timestamps: true,
    underscored: true,
  });
  return CustomerGroup;
};
