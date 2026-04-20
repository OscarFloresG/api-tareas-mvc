'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TareaTags', [
      { tareaId: 1, tagId: 1, createdAt: new Date(), updatedAt: new Date() }, // Tarea 1 es Urgente
      { tareaId: 1, tagId: 2, createdAt: new Date(), updatedAt: new Date() }, // Tarea 1 es Trabajo
      { tareaId: 2, tagId: 3, createdAt: new Date(), updatedAt: new Date() }  // Tarea 2 es Personal
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TareaTags', null, {});
  }
};