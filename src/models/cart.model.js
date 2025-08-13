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
      // A Cart has one Order, representing the order created from this cart.
      Cart.hasOne(models.Order, {
        foreignKey: 'cart_id',
      });
    }
  }
  Cart.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: DataTypes.STRING, // Represents the email address associated with the cart.
    shipping_address_id: DataTypes.STRING, // A foreign key referencing the Address model, indicating the shipping address selected for the cart.
    customer_id: DataTypes.STRING, // A foreign key referencing the Customer model, linking the cart to a registered customer.
    completed_at: DataTypes.DATE, // A timestamp indicating when the cart was completed and converted into an order.
    idempotency_key: DataTypes.STRING, // A unique key for ensuring requests are processed only once.
    sales_channel_id: { // A foreign key referencing the SalesChannel model, indicating the sales channel.
      type: DataTypes.STRING,
      references: {
        model: 'sales_channels', // table name
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};