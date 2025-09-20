import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token no válido" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "No autorizado" });
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Requiere permisos de admin" });
  next();
};
