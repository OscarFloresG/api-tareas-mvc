'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
    static associate(models) {
      // Una PERSONA tiene muchas TAREAS
      this.hasMany(models.Tarea, {
        foreignKey: 'personaId',
        as: 'tareas' 
      });
    }
  }
  Persona.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Persona',
  });
  return Persona;
};