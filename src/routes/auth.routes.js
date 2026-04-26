import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

//  Ruta para iniciar el proceso (Redirige a Google)
router.get('/google/login', authController.googleLoginStart); 
//  Ruta donde Google responde con el código/token
router.post('/google/callback', authController.googleCallback);
router.get('/login-test', authController.loginSimulado);

export default router;