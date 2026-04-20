'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Un TAG pertenece a muchas TAREAS (Muchos a Muchos)
      this.belongsToMany(models.Tarea, {
        through: 'TareaTags', // Tabla intermedia (debe ser el mismo nombre que en tarea.js)
        foreignKey: 'tagId',
        as: 'tareas'
      });
    }
  }
  Tag.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};