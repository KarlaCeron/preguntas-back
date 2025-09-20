import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apodo: { type: String }, // nickname optional
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  estadisticas: {
    partidasJugadas: { type: Number, default: 0 },
    victorias: { type: Number, default: 0 },
    aciertosPorCategoria: { type: Map, of: Number, default: {} },
  },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
