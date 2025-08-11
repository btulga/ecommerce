const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Coupon extends Model {
    static associate(models) { 
      models.Coupon.belongsToMany(models.DiscountRule, 
        { 
          through: models.CouponDiscountRule, 
          foreignKey: 'couponId', 
          otherKey: 'discountRuleId' 
        }
      ); 
    }
  }

  Coupon.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    is_disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'The maximum number of times the coupon can be used.'
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'The number of times the coupon has been used.'
    },
    starts_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    ends_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
    timestamps: true,
  });

  return Coupon;
};