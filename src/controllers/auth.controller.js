const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Simulacion de un usuario en la base de datos
const USUARIO_DB = {
  email: 'usuario@ejemplo.com',
  password: '123' 
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // 1. Validar credenciales
  if (email !== USUARIO_DB.email || password !== USUARIO_DB.password) {
    return res.status(401).json({ 
      success: false, 
      message: 'Email o contraseña incorrectos' 
    });
  }

  // 2. Si son correctos, generar tokens 
  const csrfToken = crypto.randomBytes(32).toString('hex');
  const tokenJWT = jwt.sign(
    { email, id: 1, csrfToken }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );

  res.cookie('jwt_token', tokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 
  });

  res.json({ 
    success: true, 
    usuario: { email }, 
    csrfToken 
  });
};

exports.logout = (req, res) => {
  res.clearCookie('jwt_token');
  res.json({ success: true, message: 'Sesión cerrada' });
};