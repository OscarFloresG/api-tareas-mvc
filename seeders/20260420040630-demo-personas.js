'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Personas', [{
      id: 1,
      nombre: 'Usuario Demo',
      email: 'usuario@ejemplo.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Personas', null, {});
  }
};