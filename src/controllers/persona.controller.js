import db from '../../models/index.js';
const { Tarea, Tag, Persona } = db;
// GET /api/personas
export const obtenerTodas = async (req, res) => {
    try {
        const personas = await Persona.findAll();
        res.json({ success: true, data: personas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Actividad: Todas las tareas de una Persona
export const obtenerTareasPorPersona = async (req, res) => {
    try {
        const personaConTareas = await Persona.findByPk(req.params.id, {
            include: [{ model: Tarea, as: 'tareas' }]
        });
        if (!personaConTareas) return res.status(404).json({ message: "Persona no encontrada" });
        res.json({ success: true, data: personaConTareas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Actividad: RELACIÓN INDIRECTA (Todos los Tags relacionados con una Persona)
export const obtenerTagsPorPersona = async (req, res) => {
    try {
        const personaConTags = await Persona.findByPk(req.params.id, {
            include: [{
                model: Tarea,
                as: 'tareas',
                include: [{ model: Tag, as: 'tags', through: { attributes: [] } }]
            }]
        });
        res.json({ success: true, data: personaConTags });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const crear = async (req, res) => {
    try {
        const nuevaPersona = await Persona.create(req.body);
        res.status(201).json({ success: true, data: nuevaPersona });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};