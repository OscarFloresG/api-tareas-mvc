

import express from 'express';
import * as tareaController from '../controllers/tarea.controller.js';

const router = express.Router();


// GET /api/tareas - Obtener todas las tareas
router.get('/', tareaController.obtenerTodas);

// GET /api/tareas/buscar?q=texto - Buscar tareas por título en la DB
router.get('/buscar', tareaController.buscar);

// GET /api/tareas/:id - Obtener una tarea específica por su ID
router.get('/:id', tareaController.obtenerPorId);

// POST /api/tareas - Crear una nueva tarea vinculada a una Persona
router.post('/', tareaController.crear);

// PUT /api/tareas/:id - Actualizar tarea (completamente)
router.put('/:id', tareaController.actualizarCompleta);

// PATCH /api/tareas/:id - Actualizar tarea (parcialmente)
router.patch('/:id', tareaController.actualizarParcial);

// DELETE /api/tareas/:id - Eliminar una tarea de la base de datos
router.delete('/:id', tareaController.eliminar);


// POST /api/tareas/:id/tags - Relacionar una Tarea con un Tag (Crea fila en TareaTags)
router.post('/:id/tags', tareaController.relacionarTag);

export default router;