const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartCoupon.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        allowNull: false,
      });
      CartCoupon.belongsTo(models.Coupon, {
        foreignKey: 'couponId',
        allowNull: false,
      });
    }
  }
  CartCoupon.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'carts',
        key: 'id',
      },
    },
    couponId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'coupons',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'CartCoupon',
    tableName: 'cart_coupons',
  });
  return CartCoupon;
};
