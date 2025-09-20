import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { nombre, email, password, isAdmin } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Usuario ya existe" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ nombre, email, password: hashed, isAdmin: !!isAdmin });
    await user.save();

    const token = generateToken(user);
    res.json({ token, usuario: { id: user._id, nombre: user.nombre, email: user.email, isAdmin: user.isAdmin }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Credenciales inválidas" });

    const token = generateToken(user);
    res.json({ token, usuario: { id: user._id, nombre: user.nombre, email: user.email, isAdmin: user.isAdmin }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};