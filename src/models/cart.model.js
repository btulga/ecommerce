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

      // A Cart can have many Coupons applied
      Cart.belongsToMany(models.Coupon, {
        through: 'cart_coupons',
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
    sales_channel_id: DataTypes.STRING,
    customer_id: DataTypes.STRING, // A foreign key referencing the Customer model, linking the cart to a registered customer.
    shipping_address_id: DataTypes.STRING, // A foreign key referencing the Address model, indicating the shipping address selected for the cart.

    email: DataTypes.STRING, // Represents the email address associated with the cart.
    completed_at: DataTypes.DATE, // A timestamp indicating when the cart was completed and converted into an order.
    idempotency_key: DataTypes.STRING, // A unique key for ensuring requests are processed only once.

    // price
    subtotal: DataTypes.DECIMAL(12, 5), // нийт үнэ
    discount_total: DataTypes.DECIMAL(12, 5), // хямдрал 
    shipping_total: DataTypes.DECIMAL(12, 5), // хүргэлтийн үнэ
    tax_total: DataTypes.DECIMAL(12, 5),      // татваар
    grand_total: DataTypes.DECIMAL(12, 5), // subtotal - discount_total + shipping_total + tax_total
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};