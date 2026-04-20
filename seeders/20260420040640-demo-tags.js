'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tags', [
      { id: 1, nombre: 'Urgente', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nombre: 'Trabajo', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nombre: 'Personal', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};