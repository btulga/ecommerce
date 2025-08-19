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
    customer_id: DataTypes.UUID,
    sales_channel_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'CustomerSalesChannel',
    tableName: 'customer_sales_channels',
    underscored: true,
    timestamps: true,
  });
  return CustomerSalesChannel;
};
