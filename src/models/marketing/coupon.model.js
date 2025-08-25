'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    static associate(models) {
      Coupon.belongsTo(models.Promotion, {
        foreignKey: 'promotion_id',
        as: 'promotion',
      });

      // products
      Coupon.belongsToMany(models.Product, {
        through: {
          model: 'coupon_condition',
          unique: false,
          scope: {
            condition_type: 'product',
            operator: '='
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'products',
      });
      // sales channels
      Coupon.belongsToMany(models.SalesChannel, {
        through: {
          model: 'coupon_condition',
          unique: false,
          scope: {
            condition_type: 'sales_channel',
            operator: '='
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'sales_channels',
      });
      // customers groups
      Coupon.belongsToMany(models.CustomerGroup, {
        through: {
          model: 'coupon_condition',
          unique: false,
          scope: {
            condition_type: 'customer_group',
            operator: '='
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'customer_groups',
      });

      // customers groups
      Coupon.belongsToMany(models.Customer, {
        through: {
          model: 'coupon_condition',
          unique: false,
          scope: {
            condition_type: 'customer',
            operator: '='
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'customers',
      });

      // products category
      Coupon.belongsToMany(models.Category, {
        through: {
          model: 'coupon_condition',
          unique: false,
          scope: {
            condition_type: 'category',
            operator: '='
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'categories',
      });

      // products collections
      Coupon.belongsToMany(models.Collection, {
        through: {
          model: 'coupon_condition',
          unique: false,
          scope: {
            condition_type: 'collection',
            operator: '='
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'collections',
      });
      // has many benefits
      Coupon.hasMany(models.CouponBenefit, {
        foreignKey: 'coupon_id',
        as: 'coupon_benefits',
      });
    }
  }
  Coupon.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    code: { type: DataTypes.STRING, unique: true, allowNull: false },
    // // discount type
    // discount_type: { type: DataTypes.STRING, allowNull: false }, // 'percentage','fixed'
    // // discount value
    // value: DataTypes.DECIMAL(12, 5),
    // date time
    start_date: DataTypes.DATE,
    end_date: { type: DataTypes.DATE, allowNull: true }, // null value means no end date
    // usage limit
    usage_limit: { type: DataTypes.INTEGER, defaultValue: 0},
    used_count: { type: DataTypes.INTEGER, defaultValue: 0},
    usage_per_customer: { type: DataTypes.INTEGER, defaultValue: 0},
    // other metadata
    metadata: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupon',
    timestamps: true,
    underscored: true
  });
  return Coupon;
};
