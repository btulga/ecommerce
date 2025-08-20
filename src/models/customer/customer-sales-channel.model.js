const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CustomerSalesChannel extends Model {
    static associate(models) {
      // define association here
    }
  }
  CustomerSalesChannel.init({
    customer_id: { type: DataTypes.STRING, primaryKey: true },
    sales_channel_id: { type: DataTypes.STRING, primaryKey: true },
  }, {
    sequelize,
    modelName: 'CustomerSalesChannel',
    tableName: 'customer_sales_channel',
    underscored: true,
    timestamps: true,
  });
  return CustomerSalesChannel;
};
