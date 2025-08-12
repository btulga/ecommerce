'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ProductVariant, {
        foreignKey: 'variant_id',
        as: 'variant'
      });
      this.belongsTo(models.Location, {
        foreignKey: 'location_id',
        as: 'location'
      });
    }
  }
  Inventory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    variant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'product_variants', // name of your product variants table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    location_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'locations', // name of your locations table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Inventory',
    tableName: 'inventory',
  });
  return Inventory;
};