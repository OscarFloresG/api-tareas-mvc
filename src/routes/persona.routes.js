import express from 'express';
import * as personaController from '../controllers/persona.controller.js';
const router = express.Router();

router.get('/', personaController.obtenerTodas);
router.post('/', personaController.crear);

// Endpoints de relación
router.get('/:id/tareas', personaController.obtenerTareasPorPersona);
router.get('/:id/tags', personaController.obtenerTagsPorPersona); // Relación indirecta

export default router;