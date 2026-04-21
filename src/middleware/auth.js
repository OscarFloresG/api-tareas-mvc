import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  // 1. Extraer el JWT de la cookie
  const tokenJWT = req.cookies.jwt_token;
  // 2. Extraer el CSRF del header
  const csrfTokenHeader = req.headers['x-csrf-token'];

  if (!tokenJWT || !csrfTokenHeader) {
    return res.status(401).json({ success: false, message: 'No autorizado: Faltan credenciales' });
  }

  try {
    // verificar que el JWT sea original y no haya expirado
    const decoded = jwt.verify(tokenJWT, process.env.JWT_SECRET);
    
    // validar "Doble Token": El CSRF del header debe ser igual al del JWT
    if (decoded.csrfToken !== csrfTokenHeader) {
      return res.status(401).json({ success: false, message: 'Ataque CSRF detectado' });
    }

    req.usuario = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

export default { verificarToken };