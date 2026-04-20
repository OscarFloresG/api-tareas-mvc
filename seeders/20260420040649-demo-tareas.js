'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tareas', [
      {
        id: 1,
        titulo: 'Aprender Migrations y Seeders',
        completada: true,
        personaId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        titulo: 'Conectar Frontend con MySQL',
        completada: false,
        personaId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tareas', null, {});
  }
};