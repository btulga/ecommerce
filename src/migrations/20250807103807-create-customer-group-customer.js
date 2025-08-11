'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('customer_group_customer', {
      customer_group_id: {
        type: Sequelize.UUID,
        references: {
          model: 'customer_group',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.UUID,
        references: {
          model: 'customer',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('customer_group_customer', {
      fields: ['customer_group_id', 'customer_id'],
      type: 'primary key',
      name: 'customer_group_customer_pkey',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_group_customer');
  }
};