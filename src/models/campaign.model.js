'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Campaign.belongsTo(models.DiscountRule,
          {
            foreignKey: 'rule_id',
            as: 'rule'
          }
      );
    }
  }
  Campaign.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    starts_at: DataTypes.DATE,
    ends_at: DataTypes.DATE,
    rule_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Campaign',
  });
  return Campaign;
};
