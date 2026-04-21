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

export const obtenerTagsPorPersona = async (req, res) => {
    try {
        const personaConTags = await Persona.findByPk(req.params.id, {
            include: [{
                model: Tarea,
                as: 'tareas',
                include: [{ model: Tag, as: 'tags', through: { attributes: [] } }]
            }]
        });
        if (!personaConTags) return res.status(404).json({ message: "Persona no encontrada" });
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
        res.status(400).json({ success: false, error: error.message });
    }
};

export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const [editado] = await Persona.update(req.body, { where: { id } });
        if (editado === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        const personaActualizada = await Persona.findByPk(id);
        res.json({ success: true, data: personaActualizada });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const persona = await Persona.findByPk(id);
        if (!persona) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

        persona.activo = !persona.activo;
        await persona.save();

        res.json({ 
            success: true, 
            message: `Usuario ${persona.activo ? 'activado' : 'desactivado'} correctamente`,
            data: { id: persona.id, activo: persona.activo } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const borrado = await Persona.destroy({ where: { id } });
        if (!borrado) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        res.json({ success: true, message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};