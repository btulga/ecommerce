'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', { // Note: table name is plural and lowercase
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'archived', 'canceled'),
        defaultValue: 'pending'
      },
      fulfillment_status: {
        type: Sequelize.ENUM('not_fulfilled', 'partially_fulfilled', 'fulfilled', 'shipped'),
        defaultValue: 'not_fulfilled'
      },
      payment_status: {
        type: Sequelize.ENUM('not_paid', 'awaiting', 'captured', 'refunded'),
        defaultValue: 'not_paid'
      },
      display_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique: true
      },
      customer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'customers', // table name, not model name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      billing_address_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'addresses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      shipping_address_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'addresses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      // region_id column is removed
      currency_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tax_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      draft: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
