const { createUser, getUserById, updateUserPassword } = require("../services/dynamoUser.service");
const { hashPassword } = require("../utils/hash");

async function registerUserController(req, res) {
  const { idUsuario, nombre, password,email } = req.body;

  try {
    const existente = await getUserById(idUsuario);
    if (existente) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const hashed = await hashPassword(password);
    await createUser(idUsuario, nombre, hashed,email);

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updatePasswordController(req, res) {
  const { idUsuario, nuevaPassword } = req.body;

  try {
    const hashed = await hashPassword(nuevaPassword);
    await updateUserPassword(idUsuario, hashed);

    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  registerUserController,
  updatePasswordController,
};
