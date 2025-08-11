'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Customer, {
        through: models.CustomerGroupCustomer,
        foreignKey: 'customer_group_id',
        otherKey: 'customer_id',
        as: 'customers'
      });
    }
  }
  CustomerGroup.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,

      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'CustomerGroup',
    tableName: 'customer_groups',
  });
  return CustomerGroup;
};