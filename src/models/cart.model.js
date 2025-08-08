'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.SalesChannel, {
        foreignKey: 'sales_channel_id',
        as: 'sales_channel'
      });
    }
  }
  Cart.init({
    email: DataTypes.STRING,
    billing_address_id: DataTypes.STRING,
    shipping_address_id: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    payment_id: DataTypes.STRING,
    type: DataTypes.STRING,
    completed_at: DataTypes.DATE,
    payment_authorized_at: DataTypes.DATE,
    idempotency_key: DataTypes.STRING,
    sales_channel_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};