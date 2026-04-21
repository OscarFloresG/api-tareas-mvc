import db from '../../models/index.js';
const { Tarea, Tag, Persona } = db;
import { Op } from 'sequelize';

export const obtenerTodas = async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      include: [
        { model: Tag, as: 'tags', through: { attributes: [] } },
        { model: Persona, as: 'persona' }
      ]
    });

    if (req.query.formato === 'text') {
      let textoRespuesta = "LISTADO DE TAREAS\n";
      tareas.forEach(t => {
        const estado = t.completada ? "[Completada]" : "[Pendiente]";
        textoRespuesta += `- ID: ${t.id} | ${t.titulo} | ${estado}\n`;
      });
      res.setHeader('Content-Type', 'text/plain');
      return res.send(textoRespuesta);
    }

    res.json({ success: true, data: tareas, count: tareas.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const tarea = await Tarea.findByPk(req.params.id, {
      include: [
        { model: Tag, as: 'tags', through: { attributes: [] } },
        { model: Persona, as: 'persona' }
      ]
    });
    if (!tarea) return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    res.json({ success: true, data: tarea });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const { titulo, completada, personaId } = req.body;
    if (!titulo) return res.status(400).json({ message: 'Título requerido' });

    const nuevaTarea = await Tarea.create({ titulo, completada, personaId });
    res.status(201).json({ success: true, data: nuevaTarea });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const actualizarCompleta = async (req, res) => {
  try {
    const { titulo, completada, personaId } = req.body;
    const [actualizado] = await Tarea.update(
      { titulo, completada, personaId }, 
      { where: { id: req.params.id } }
    );
    if (!actualizado) return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    res.json({ success: true, message: 'Tarea actualizada completamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const actualizarParcial = async (req, res) => {
  try {
    const id = req.params.id;
    const [actualizado] = await Tarea.update(req.body, { where: { id } });
    if (!actualizado) return res.status(404).json({ message: 'No encontrada' });
    const tarea = await Tarea.findByPk(id);
    res.json({ success: true, data: tarea });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const id = req.params.id;
    const borrada = await Tarea.destroy({ where: { id } });
    if (!borrada) return res.status(404).json({ message: 'No encontrada' });
    res.json({ success: true, message: 'Eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const relacionarTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tagId } = req.body;
    const tarea = await Tarea.findByPk(id);
    if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
    await tarea.addTag(tagId); 
    res.json({ success: true, message: 'Tag vinculado a la tarea' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const buscar = async (req, res) => {
  try {
    const termino = req.query.q;
    const tareas = await Tarea.findAll({
      where: { titulo: { [Op.like]: `%${termino}%` } },
      include: ['tags']
    });
    res.json({ success: true, data: tareas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
