const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Payment extends Model {}

  Payment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Identifier for the payment provider (e.g., "stripe", "paypal").'
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Stores non-sensitive data from the payment provider, like payment intent ID.'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // e.g., 'pending', 'captured', 'failed'
    },
    // Foreign key for Order will be added via associations
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
  });

  Payment.associate = (models) => {
    // Define the relationship between the Payment and Order models. A Payment belongs to one Order.
    Payment.belongsTo(models.Order, {
      foreignKey: 'order_id', // Assuming the foreign key column in the payments table is 'order_id'
      as: 'order',
    });
  };

  return Payment;
};
