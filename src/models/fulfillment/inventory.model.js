'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      this.belongsTo(models.ProductVariant, { foreignKey: 'variant_id', as: 'variant' });
      this.belongsTo(models.Location, { foreignKey: 'location_id', as: 'location' });
    }
  }
  Inventory.init({
    id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    variant_id: { type: DataTypes.STRING, allowNull: false },
    location_id: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    sequelize,
    modelName: 'Inventory',
    tableName: 'inventory',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['variant_id', 'location_id'] }]
  });
  return Inventory;
};
