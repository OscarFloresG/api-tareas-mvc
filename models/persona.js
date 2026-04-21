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
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
      validate: {
        isEmail: true
      }
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true 
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Persona',
    tableName: 'Personas',
  });

  return Persona;
};