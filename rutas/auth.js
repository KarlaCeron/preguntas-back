import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../modulos/Usuario.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si existe
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ msg: "El usuario ya existe" });

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
    });

    await nuevoUsuario.save();
    res.json({ msg: "Usuario registrado con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ msg: "Usuario no encontrado" });

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return res.status(400).json({ msg: "Credenciales inválidas" });

    // Generar token
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
