'use strict';
const { Model, DataTypes} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PromotionUsage extends Model {
    static associate(models) {
      PromotionUsage.belongsTo(models.Promotion, { foreignKey: 'promotion_id' });
      PromotionUsage.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    }
  }
  PromotionUsage.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    promotion_id: { type: DataTypes.STRING },
    customer_id: { type: DataTypes.STRING },
    used_count: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, {
    sequelize,
    modelName: 'PromotionUsage',
    tableName: 'promotion_usage',
    timestamps: true,
    underscored: true
  });
  return PromotionUsage;
};
