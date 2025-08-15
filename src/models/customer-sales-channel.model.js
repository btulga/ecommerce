const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CustomerSalesChannel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustomerSalesChannel.init({
    customer_id: {
      type: DataTypes.UUID,
      references: {
        model: 'customers', // name of the target model
        key: 'id', // key in the target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    sales_channel_id: {
      type: DataTypes.UUID,
      references: {
        model: 'sales_channels', // name of the target model
        key: 'id', // key in the target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'CustomerSalesChannel',
    tableName: 'customer_sales_channels',
    underscored: true,
    timestamps: true,
  });
  return CustomerSalesChannel;
};