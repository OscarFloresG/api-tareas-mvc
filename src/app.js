import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Middlewares
import { verificarToken } from './middleware/auth.js';

// Rutas
import authRoutes from './routes/auth.routes.js';
import tareaRoutes from './routes/tarea.routes.js';
import personaRoutes from './routes/persona.routes.js';
import tagRoutes from './routes/tag.routes.js';

const app = express();

// --- Middlewares Globales ---
app.use(express.json());
app.use(cookieParser()); 

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true
}));


app.use('/api/auth', authRoutes);

// Gestión de Tareas (CRUD y relación con Tags)
app.use('/api/tareas', verificarToken, tareaRoutes);

// Gestión de Usuarios/Personas (CRUD, Activación, Modificación)
app.use('/api/personas', verificarToken, personaRoutes);

// Gestión de Tags (CRUD y relaciones indirectas)
app.use('/api/tags', verificarToken, tagRoutes);

// --- Manejo de errores 404 ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de error global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

export default app;