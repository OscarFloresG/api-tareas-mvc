import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import db from '../../models/index.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { Persona } = db;

/**
 * PUNTO 2.1 - Inicio de sesión
 * Prepara al cliente o confirma disponibilidad del servicio de Auth.
 */
export const googleLoginStart = async (req, res) => {
    res.json({ 
        success: true, 
        message: 'Backend listo para recibir credenciales de Google OAuth',
        clientId: process.env.GOOGLE_CLIENT_ID 
    });
};

/**
 * PUNTO 2.1 - Callback de Google OAuth
 * Procesa el token, valida el dominio @uabc.edu.mx y registra en la DB.
 */
export const googleCallback = async (req, res) => {
    const { googleToken } = req.body;

    try {
        // 1. Verificación criptográfica con Google
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const { sub: googleId, email, name } = ticket.getPayload();

        // 2. Validación de Dominio Institucional 
        if (!email.endsWith('@uabc.edu.mx')) {
            return res.status(403).json({ 
                success: false, 
                message: 'Acceso denegado: Solo se permiten correos @uabc.edu.mx' 
            });
        }

        let usuario = await Persona.findOne({ where: { email } });

        if (!usuario) {
            usuario = await Persona.create({
                nombre: name,
                email: email,
                googleId: googleId,
                activo: true
            });
            console.log(`Nuevo usuario registrado: ${email}`);
        } 
        
        // Verificación de estado activo (Eliminación lógica)
        if (!usuario.activo) {
            return res.status(403).json({ 
                success: false, 
                message: 'Usuario desactivado. Contacte al administrador.' 
            });
        }

        // 4. Generación de JWT y CSRF Token para la sesión
        const csrfToken = crypto.randomBytes(32).toString('hex');
        const tokenJWT = jwt.sign(
            { id: usuario.id, email: usuario.email, csrfToken }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.cookie('jwt_token', tokenJWT, {
            httpOnly: true,
            secure: true,   
            sameSite: 'none', 
            maxAge: 86400000 // 24 horas
        });

        res.json({ 
            success: true, 
            usuario: { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                email: usuario.email 
            }, 
            csrfToken 
        });

    } catch (error) {
        console.error('Error en Google Callback:', error);
        res.status(401).json({ success: false, message: 'Fallo en la autenticación de Google' });
    }
};

/**
 * Cierre de sesión (Borrado de cookie)
 */
export const logout = (req, res) => {
    res.clearCookie('jwt_token');
    res.json({ success: true, message: 'Sesión cerrada correctamente' });
};

/**
 * FUNCIÓN TRAMPA: Simulación de Login para pruebas locales con archivo .http
 * NO verifica con Google, pero genera una cookie válida para el sistema.
 */
export const loginSimulado = async (req, res) => {
    try {
        const datosPrueba = {
            nombre: "Alumno Prueba Seguridad",
            email: "alumno.seguridad@uabc.edu.mx", 
            googleId: "SIMULADO_999",
            activo: true
        };

        // 1. Intentar buscar o crear en la base de datos
        const [usuario, creado] = await Persona.findOrCreate({
            where: { email: datosPrueba.email },
            defaults: datosPrueba
        });

        if (creado) {
            console.log(" Nuevo usuario de prueba creado en la DB");
        } else {
            console.log("ℹ El usuario de prueba ya existía, usando registro actual");
        }

        // 2. Generar el JWT 
        const csrfToken = crypto.randomBytes(32).toString('hex');
        const tokenJWT = jwt.sign(
            { id: usuario.id, email: usuario.email, csrfToken }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 3. Mandar la Cookie Segura (HTTPS)
        res.cookie('jwt_token', tokenJWT, {
            httpOnly: true,
            secure: true, 
            sameSite: 'none',
            maxAge: 86400000 
        });

        res.json({ 
            success: true, 
            message: creado ? "Usuario creado y cookie enviada" : "Usuario recuperado y cookie enviada", 
            usuario: { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                email: usuario.email 
            }
        });

    } catch (error) {
        console.error(" Error en el simulado:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al interactuar con la base de datos",
            error: error.message 
        });
    }
};