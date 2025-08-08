'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhoneNumber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
      this.belongsTo(models.OrderItem, {
        foreignKey: 'order_item_id',
        as: 'orderItem',
        allowNull: true
      });
    }
  }
  PhoneNumber.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['available', 'reserved', 'sold', 'deactivated'],
      defaultValue: 'available',
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products', // Assumes your product table is named 'Products'
        key: 'id',
      },
    },
    order_item_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'OrderItems', // Assumes your order item table is named 'OrderItems'
        key: 'id',
      },
    },
    activation_status: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'PhoneNumber',
    tableName: 'phone_numbers', // Explicitly set table name
  });
  return PhoneNumber;
};