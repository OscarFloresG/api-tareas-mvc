
import express from 'express';
import * as tagController from '../controllers/tag.controller.js';
const router = express.Router();

// GET /api/tags - Obtener todos los tags
router.get('/', tagController.obtenerTodos);

// GET /api/tags/:id/tareas - Obtener todas las TAREAS asociadas a un TAG
router.get('/:id/tareas', tagController.obtenerTareasPorTag);

// GET /api/tags/:id/personas - RELACIÓN INDIRECTA: Todas las PERSONAS relacionadas con un TAG
router.get('/:id/personas', tagController.obtenerPersonasPorTag);

// POST /api/tags - Crear un nuevo tag
router.post('/', tagController.crear);

// DELETE /api/tags/:id - Eliminar un tag
router.delete('/:id', tagController.eliminar);

export default router;