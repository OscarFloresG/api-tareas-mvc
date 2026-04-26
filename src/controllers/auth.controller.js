import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import db from '../../models/index.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { Persona } = db;

/**
 * 2.1 - Manejar el inicio de sesión (Redirigir o preparar)
 * En este caso, simplemente confirmamos que el backend está listo para recibir el token.
 */
export const googleLoginStart = async (req, res) => {
    res.json({ 
        success: true, 
        message: 'Listo para recibir credenciales de Google',
        clientId: process.env.GOOGLE_CLIENT_ID 
    });
};

/**
 * 2.1 - Callback de Google (Procesar la autenticación)
 * Aquí es donde Google nos envía el token y nosotros registramos/logueamos.
 */
export const googleCallback = async (req, res) => {
    const { googleToken } = req.body;

    try {
        // 1. Verificar token con Google
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { sub: googleId, email, name } = ticket.getPayload();

        // 2. Punto 2 de la rúbrica: Tabla de usuarios (Buscar o Crear)
        let usuario = await Persona.findOne({ where: { email } });

        if (!usuario) {
            // Registro automático si es nuevo
            usuario = await Persona.create({
                nombre: name,
                email: email,
                googleId: googleId,
                activo: true
            });
        } 
        
        // Verificación de estado (Eliminación lógica)
        if (!usuario.activo) {
            return res.status(403).json({ 
                success: false, 
                message: 'Usuario desactivado. Contacte al administrador.' 
            });
        }

        // 3. Generación de JWT y Seguridad
        const csrfToken = crypto.randomBytes(32).toString('hex');
        const tokenJWT = jwt.sign(
            { id: usuario.id, email: usuario.email, csrfToken }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. Envío de Cookie Segura (Punto 1 de rúbrica: TLS/Secure)
        res.cookie('jwt_token', tokenJWT, {
            httpOnly: true,
            secure: true, // Siempre true porque ya implementaste TLS/SSL
            sameSite: 'none', // Cambiado a 'none' si tu frontend está en otro puerto (ej: 3001)
            maxAge: 86400000 
        });

        res.json({ 
            success: true, 
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }, 
            csrfToken 
        });

    } catch (error) {
        console.error('Error en Google Callback:', error);
        res.status(401).json({ success: false, message: 'Autenticación fallida' });
    }
};

// Logout: Limpiar la cookie
export const logout = (req, res) => {
    res.clearCookie('jwt_token');
    res.json({ success: true, message: 'Sesión cerrada' });
};

// FUNCIÓN TRAMPA (Mantenla solo para pruebas locales)
export const loginSimulado = async (req, res) => {
    try {
        const fakePayload = {
            googleId: "123456789_SIMULADO",
            email: "tu.correo.uabc@uabc.edu.mx", 
            name: "Usuario de Prueba"
        };

        let usuario = await Persona.findOne({ where: { email: fakePayload.email } });
        if (!usuario) {
            usuario = await Persona.create({
                nombre: fakePayload.name, email: fakePayload.email,
                googleId: fakePayload.googleId, activo: true
            });
        }

        const csrfToken = crypto.randomBytes(32).toString('hex');
        const tokenJWT = jwt.sign(
            { id: usuario.id, email: usuario.email, csrfToken }, 
            process.env.JWT_SECRET, { expiresIn: '24h' }
        );

        res.cookie('jwt_token', tokenJWT, {
            httpOnly: true,
            secure: true, // Cambiado a true por tu SSL
            sameSite: 'none',
            maxAge: 86400000 
        });

        res.json({ success: true, message: "Cookie simulada enviada", usuario: { id: usuario.id, nombre: usuario.nombre } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};