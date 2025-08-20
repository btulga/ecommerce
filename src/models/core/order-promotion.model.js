const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderPromotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderPromotion.belongsTo(models.Order, {
        foreignKey: 'order_id',
        allowNull: false,
      });
      OrderPromotion.belongsTo(models.Promotion, {
        foreignKey: 'promotion_id',
        allowNull: false,
      });
      OrderPromotion.belongsTo(models.Coupon, {
        foreignKey: 'coupon_id',
        allowNull: false,
      });
    }
  }
  OrderPromotion.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    order_id: { type: DataTypes.STRING },
    promotion_id: { type: DataTypes.STRING },
    coupon_id: { type: DataTypes.STRING },
    discount_amount: { type: DataTypes.DECIMAL(12,5) },
  }, {
    sequelize,
    modelName: 'OrderPromotion',
    tableName: 'order_promotion',
  });
  return OrderPromotion;
};
