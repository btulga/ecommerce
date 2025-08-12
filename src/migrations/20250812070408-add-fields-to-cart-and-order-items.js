'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('cart_items', 'selected_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('cart_items', 'activation_code', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('order_items', 'selected_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('order_items', 'activation_code', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('order_items', 'activation_status', {
      type: Sequelize.STRING,
      allowNull: true, // Can be null initially or have a default
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('cart_items', 'selected_number');
    await queryInterface.removeColumn('cart_items', 'activation_code');

    await queryInterface.removeColumn('order_items', 'selected_number');
    await queryInterface.removeColumn('order_items', 'activation_code');
    await queryInterface.removeColumn('order_items', 'activation_status');
  }
};
