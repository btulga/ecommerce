const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartPromotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartPromotion.belongsTo(models.Cart, {
        foreignKey: 'cart_id',
        allowNull: false,
      });
      CartPromotion.belongsTo(models.Promotion, {
        foreignKey: 'promotion_id',
        allowNull: false,
      });
      CartPromotion.belongsTo(models.Coupon, {
        foreignKey: 'coupon_id',
        allowNull: false,
      });
    }
  }
  CartPromotion.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    cart_id: { type: DataTypes.STRING },
    promotion_id: { type: DataTypes.STRING },
    coupon_id: { type: DataTypes.STRING },
    discount_amount: { type: DataTypes.DECIMAL(12, 5) },
  }, {
    sequelize,
    modelName: 'CartPromotion',
    tableName: 'cart_promotion',
  });
  return CartPromotion;
};
