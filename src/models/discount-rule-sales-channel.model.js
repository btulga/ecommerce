'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscountRuleSalesChannel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DiscountRuleSalesChannel.belongsTo(models.DiscountRule, {
        foreignKey: 'discount_rule_id',
        as: 'discountRule'
      });
      DiscountRuleSalesChannel.belongsTo(models.SalesChannel, {
        foreignKey: 'sales_channel_id',
        as: 'salesChannel'
      });
    }
  }
  DiscountRuleSalesChannel.init({
    discount_rule_id: DataTypes.UUID,
    sales_channel_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'DiscountRuleSalesChannel',
    tableName: 'discount_rule_sales_channels',
    timestamps: false,
  });
  return DiscountRuleSalesChannel;
};
