import { User } from "../models/User.js";
import { Game } from "./models/Game.js";
import { Stat } from "../models/Stat.js";

export const dashboardData = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password");
    const partidas = await Game.find().populate("ganador", "nombre email").sort({ createdAt: -1 }).limit(50);
    const stats = (await Stat.findOne()) || { partidasTotales: 0, categoriasAciertos: {} };

    // ranking de ganadores simple
    const ranking = usuarios
      .map(u => ({ nombre: u.nombre, victorias: u.estadisticas?.victorias || 0 }))
      .sort((a,b)=> b.victorias - a.victorias);

    res.json({ usuarios, partidas, stats, ranking });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
