'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      billing_address_id: {
        type: Sequelize.STRING
      },
      shipping_address_id: {
        type: Sequelize.STRING
      },
      region_id: {
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.STRING
      },
      payment_id: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      completed_at: {
        type: Sequelize.DATE
      },
      payment_authorized_at: {
        type: Sequelize.DATE
      },
      idempotency_key: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Carts');
  }
};