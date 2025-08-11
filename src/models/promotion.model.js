'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promotion.belongsTo(models.Campaign, { foreignKey: 'campaignId' });
    }
  }
  Promotion.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
 active: DataTypes.BOOLEAN,
    campaignId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Promotion',
  });
  return Promotion;
};