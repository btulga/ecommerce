'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductVariants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      sku: {
        type: Sequelize.STRING
      },
      barcode: {
        type: Sequelize.STRING
      },
      ean: {
        type: Sequelize.STRING
      },
      upc: {
        type: Sequelize.STRING
      },
      inventory_quantity: {
        type: Sequelize.INTEGER
      },
      allow_backorder: {
        type: Sequelize.BOOLEAN
      },
      manage_inventory: {
        type: Sequelize.BOOLEAN
      },
      hs_code: {
        type: Sequelize.STRING
      },
      origin_country: {
        type: Sequelize.STRING
      },
      mid_code: {
        type: Sequelize.STRING
      },
      material: {
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
    await queryInterface.dropTable('ProductVariants');
  }
};