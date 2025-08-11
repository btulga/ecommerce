'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerGroupCustomer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CustomerGroup, {
        foreignKey: 'customer_group_id',
        targetKey: 'id',
        as: 'customerGroup'
      });
      this.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        targetKey: 'id',
        as: 'customer'
      });
    }
  }
  CustomerGroupCustomer.init({
    customer_group_id: {
      type: DataTypes.UUID,
      references: {
        model: 'customer_groups', // This should be the table name for CustomerGroup
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE', // Use ON UPDATE CASCADE for consistency
      primaryKey: true, // Composite primary key
    },
    customer_id: {
      type: DataTypes.UUID,
      references: {
        model: 'customers', // This should be the table name for Customer
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE', // Use ON UPDATE CASCADE for consistency
      primaryKey: true, // Composite primary key
    },
  }, {
    sequelize,
    modelName: 'CustomerGroupCustomer',
    tableName: 'customer_group_customers',
    timestamps: false, // Join tables often don't need timestamps
  }); // Added semicolon for consistency
  return CustomerGroupCustomer;
};