const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { verificarToken } = require('./middleware/auth');
const authController = require('./controllers/auth.controller');
const tareaRoutes = require('./routes/tarea.routes');

const app = express();

// Configuracion de Middlewares globales
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true
}));

app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);

app.use('/api/tareas', verificarToken, tareaRoutes);

module.exports = app;