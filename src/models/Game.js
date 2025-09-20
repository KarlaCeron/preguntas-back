import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  apodo: String,
  socketId: String,
  puntos: { type: Number, default: 0 },
  eliminado: { type: Boolean, default: false },
});

const gameSchema = new mongoose.Schema({
  estado: { type: String, enum: ["lobby","en_curso","finalizado"], default: "lobby" },
  jugadores: [playerSchema],
  preguntas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  categoria: String,
  ganador: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resultados: [{ jugadorId: String, puntos: Number }],
  startedAt: Date,
  endedAt: Date,
}, { timestamps: true });

export const Game = mongoose.model("Game", gameSchema);
