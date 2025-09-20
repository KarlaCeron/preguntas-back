import { Game } from "./models/Game.js";
import { Question } from "../models/Question.js";
import { User } from "../models/User.js";
import { Stat } from "../models/Stat.js";

export const crearPartida = async (req, res) => {
  try {
    const { categoria, preguntaIds } = req.body;
    const preguntas = preguntaIds?.length ? preguntaIds : (await Question.find({ categoria }).limit(20)).map(q => q._id);
    const game = new Game({ categoria, preguntas });
    await game.save();
    res.json(game);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const listarPreguntas = async (req, res) => {
  try {
    const preguntas = await Question.find();
    res.json(preguntas);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const guardarResultadoPartida = async (req, res) => {
  try {
    const { gameId, resultados } = req.body; // resultados: [{ usuarioId, puntos }]
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ msg: "Partida no encontrada" });

    // guardar resultados, actualizar ganador y estadisticas de usuarios
    const sorted = resultados.sort((a,b)=> b.puntos - a.puntos);
    const winner = sorted[0];

    game.resultados = resultados;
    game.ganador = winner.usuarioId;
    game.estado = "finalizado";
    game.endedAt = new Date();
    await game.save();

    // actualizar usuarios
    for (const r of resultados) {
      const u = await User.findById(r.usuarioId);
      if (!u) continue;
      u.estadisticas.partidasJugadas = (u.estadisticas.partidasJugadas || 0) + 1;
      if (r.usuarioId.toString() === winner.usuarioId.toString()) {
        u.estadisticas.victorias = (u.estadisticas.victorias || 0) + 1;
      }
      // ejemplo categoría aciertos no implementado aquí (depende de respuestas)
      await u.save();
    }

    // actualizar estadisticas globales
    let st = (await Stat.findOne()) || new Stat();
    st.partidasTotales = (st.partidasTotales || 0) + 1;
    await st.save();

    res.json({ msg: "Resultados guardados" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
