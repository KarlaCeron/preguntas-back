import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  opciones: [{ type: String, required: true }],
  correcta: { type: Number, required: true }, // index de la opción correcta
  categoria: { type: String, required: true },
  dificultad: { type: String, default: "media" },
}, { timestamps: true });

export const Question = mongoose.model("Question", questionSchema);
