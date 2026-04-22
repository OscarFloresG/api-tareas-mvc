/**
 * Punto de entrada de la aplicación con HTTPS
 */

import app from './src/app.js';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Necesario para ES Modules

// --- Configuración para arreglar __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---------------------------------------------

const PORT = process.env.PORT || 3000;

try {
    // Configurar opciones para el servidor HTTPS
    const options = {
        key: fs.readFileSync(path.join(__dirname, 'src', 'ssl', 'private.key')),
        cert: fs.readFileSync(path.join(__dirname, 'src', 'ssl', 'certificate.crt'))
    };

    // Crear servidor HTTPS
    const server = https.createServer(options, app);

    server.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en https://localhost:${PORT}`);
        console.log(`📚 Documentación de endpoints: https://localhost:${PORT}`);
    });
} catch (error) {
    console.error("❌ Error al iniciar el servidor HTTPS. ¿Olvidaste crear los certificados?");
    console.error(error.message);
    process.exit(1);
}