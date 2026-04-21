import db from '../../models/index.js';
const { Tarea, Tag, Persona } = db;

export const obtenerTodos = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.json({ success: true, data: tags });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const obtenerTareasPorTag = async (req, res) => {
    try {
        const tagConTareas = await Tag.findByPk(req.params.id, {
            include: [{
                model: Tarea,
                as: 'tareas',
                through: { attributes: [] } 
            }]
        });
        if (!tagConTareas) return res.status(404).json({ message: "Tag no encontrado" });
        res.json({ success: true, data: tagConTareas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const obtenerPersonasPorTag = async (req, res) => {
    try {
        const personas = await Tag.findByPk(req.params.id, {
            include: [{
                model: Tarea,
                as: 'tareas',
                include: [{ model: Persona, as: 'persona' }]
            }]
        });
        res.json({ success: true, data: personas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const crear = async (req, res) => {
    try {
        const nuevoTag = await Tag.create(req.body);
        res.status(201).json({ success: true, data: nuevoTag });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const eliminar = async (req, res) => {
    try {
        await Tag.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: "Tag eliminado" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};