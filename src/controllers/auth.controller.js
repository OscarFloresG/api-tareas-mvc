import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import db from '../../models/index.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { Persona } = db;

export const googleLogin = async (req, res) => {
    const { googleToken } = req.body;

    try {
        // 1. Verificar token con Google
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { sub: googleId, email, name } = ticket.getPayload();

        // 2. Buscar o crear usuario (Punto 3 de la rúbrica: Registro)
        let usuario = await Persona.findOne({ where: { email } });

        if (!usuario) {
            usuario = await Persona.create({
                nombre: name,
                email: email,
                googleId: googleId,
                activo: true
            });
        } 
        
        if (!usuario.activo) {
            return res.status(403).json({ 
                success: false, 
                message: 'Usuario desactivado. Contacte al administrador.' 
            });
        }

        const csrfToken = crypto.randomBytes(32).toString('hex');
        const tokenJWT = jwt.sign(
            { id: usuario.id, email: usuario.email, csrfToken }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.cookie('jwt_token', tokenJWT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
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
        console.error('Error en Google Login:', error);
        res.status(401).json({ success: false, message: 'Autenticación fallida' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('jwt_token');
    res.json({ success: true, message: 'Sesión cerrada' });
};