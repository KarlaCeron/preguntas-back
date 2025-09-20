import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  partidasTotales: { type: Number, default: 0 },
  categoriasAciertos: { type: Map, of: Number, default: {} },
}, { timestamps: true });

export const Stat = mongoose.model("Stat", statSchema);
