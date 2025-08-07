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

  return Payment;
};
