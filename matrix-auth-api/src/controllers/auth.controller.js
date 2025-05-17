const { getUserByEmail } = require('../services/dynamoUser.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const userItem = await getUserByEmail(email);
    
    if (!userItem) {
      return res.status(401).json({ message: 'Credenciales inválidas' }); 
    }

    // userItem tiene formato DynamoDB, extraemos password 
    const storedHashedPassword = userItem.password.S;

    // Verificamos contraseña 
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { idUsuario: userItem.idUsuario.S, nombre: userItem.nombre.S },  // payload
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login };
