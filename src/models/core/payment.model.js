'use strict';
const { DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
        }
    }
    Payment.init({
        id: { type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        amount: { type: DataTypes.DECIMAL(12,5), allowNull: false },
        order_id: { type: DataTypes.STRING, allowNull: false },
        currency_code: { type: DataTypes.STRING, allowNull: false },
        provider_id: { type: DataTypes.STRING, allowNull: false },
        data: { type: DataTypes.JSONB, allowNull: true },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    }, {
        sequelize,
        modelName: 'Payment',
        tableName: 'payment',
        timestamps: true,
        underscored: true,
    });
    return Payment;
};
