'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    static associate(models) {
      // belongs to campaign
      Promotion.belongsTo(models.Campaign, {
        foreignKey: 'campaign_id',
        as: 'campaign',
      });

      // products
      Promotion.belongsToMany(models.Product, {
        through: {
          model: 'promotion_condition',
          unique: false,
          scope: {
            condition_type: 'product'
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'products',
      });
      // sales channels
      Promotion.belongsToMany(models.SalesChannel, {
        through: {
          model: 'promotion_condition',
          unique: false,
          scope: {
            condition_type: 'sales_channel',
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'sales_channels',
      });
      // customers groups
      Promotion.belongsToMany(models.CustomerGroup, {
        through: {
          model: 'promotion_condition',
          unique: false,
          scope: {
            condition_type: 'customer_group',
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'customer_groups',
      });

      // customers groups
      Promotion.belongsToMany(models.Customer, {
        through: {
          model: 'promotion_condition',
          unique: false,
          scope: {
            condition_type: 'customer',
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'customers',
      });

      // products category
      Promotion.belongsToMany(models.Category, {
        through: {
          model: 'promotion_condition',
          unique: false,
          scope: {
            condition_type: 'category',
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'categories',
      });

      // products collections
      Promotion.belongsToMany(models.Collection, {
        through: {
          model: 'promotion_condition',
          unique: false,
          scope: {
            condition_type: 'collection',
          }
        },
        foreignKey: 'condition_value',
        constraints: false,
        as: 'collections',
      });
    }
  }
  Promotion.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    campaign_id: DataTypes.STRING,
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
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
    modelName: 'Promotion',
    tableName: 'promotion',
    timestamps: true,
    underscored: true
  });
  return Promotion;
};
