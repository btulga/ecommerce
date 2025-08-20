const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderCoupon.belongsTo(models.Order, {
        foreignKey: 'order_id',
        allowNull: false,
      });
      OrderCoupon.belongsTo(models.Coupon, {
        foreignKey: 'coupon_id',
        allowNull: false,
      });
    }
  }
  OrderCoupon.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    order_id: { type: DataTypes.STRING },
    coupon_id: { type: DataTypes.STRING },
    applied_at: { type: DataTypes.DATE },
    discount_amount: { type: DataTypes.DECIMAL(12,5) },
  }, {
    sequelize,
    modelName: 'OrderCoupon',
    tableName: 'order_coupon',
  });
  return OrderCoupon;
};
