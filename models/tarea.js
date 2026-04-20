'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tarea extends Model {
    static associate(models) {
      // Una TAREA pertenece a una PERSONA
      this.belongsTo(models.Persona, {
        foreignKey: 'personaId',
        as: 'persona'
      });

      // Una TAREA tiene muchos TAGS (Muchos a Muchos)
      this.belongsToMany(models.Tag, {
        through: 'TareaTags', // Tabla intermedia
        foreignKey: 'tareaId',
        as: 'tags'
      });
    }
  }
  Tarea.init({
    titulo: DataTypes.STRING,
    completada: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    personaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tarea',
  });
  return Tarea;
};