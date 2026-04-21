import express from 'express';
import * as personaController from '../controllers/persona.controller.js';

const router = express.Router();

router.get('/', personaController.obtenerTodas);         
router.post('/', personaController.crear);               
router.put('/:id', personaController.actualizar);        
router.delete('/:id', personaController.eliminar);      


router.patch('/:id/estado', personaController.cambiarEstado); 

router.get('/:id/tareas', personaController.obtenerTareasPorPersona);
router.get('/:id/tags', personaController.obtenerTagsPorPersona);

export default router;