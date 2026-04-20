import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { verificarToken } from './middleware/auth.js'; // IMPORTANTE: Agregar .js
import * as authController from './controllers/auth.controller.js';
import tareaRoutes from './routes/tarea.routes.js';
import personaRoutes from './routes/persona.routes.js';
import tagRoutes from './routes/tag.routes.js';        // Nueva ruta

const app = express();

// --- Configuración de Middlewares globales ---
app.use(express.json());
app.use(cookieParser()); 

// Configuración de CORS (Importante: puerto 3001 para tu Vue)
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true
}));

// --- Rutas Públicas (Auth) ---
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);

// --- Rutas Protegidas (Requieren verificarToken) ---

// Gestión de Tareas (CRUD y relación con Tags)
app.use('/api/tareas', verificarToken, tareaRoutes);

// Gestión de Personas (CRUD y tareas por persona)
app.use('/api/personas', verificarToken, personaRoutes);

// Gestión de Tags (CRUD y tareas por tag)
app.use('/api/tags', verificarToken, tagRoutes);

// --- Manejo de errores 404 ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

export default app;