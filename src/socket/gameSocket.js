import { Game } from "./models/Game.js";
import { Question } from "../models/Question.js";
import { User } from "../models/User.js";

/**
 * Manejo simple de lobby / room. Puedes extender lógica (rooms por gameId, timers, etc).
 */
 
let waitingGames = {}; // gameId -> { jugadores: [{id,nombre,socketId}], estado... }

export const gameSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Usuario conectado:", socket.id);

    socket.on("registrarJugador", async ({ gameId, userId, apodo }) => {
      // si llega gameId vincular a partida ya creada
      let game = null;
      if (gameId) {
        game = await Game.findById(gameId);
      }
      // si no: buscar o crear un lobby en memoria por socket (simple)
      if (!game) {
        // manejo simple: usar un lobby temporal
        if (!waitingGames["default"]) waitingGames["default"] = { jugadores: [] };
        waitingGames["default"].jugadores.push({ socketId: socket.id, userId, apodo });
        io.emit("jugadoresActualizados", waitingGames["default"].jugadores);
        if (waitingGames["default"].jugadores.length >= 5) {
          io.emit("iniciarJuego", { gameId: "default" });
        }
      } else {
        // si game existe, añadir jugador en DB
        game.jugadores.push({ userId, apodo, socketId: socket.id });
        await game.save();
        io.to(socket.id).emit("partidaUnido", game._id);
        io.emit("jugadoresActualizados", game.jugadores);
      }
    });

    socket.on("enviarRespuesta", (data) => {
      // data: { gameId, preguntaId, usuarioId, opcion }
      // emitir a dashboard / otros jugadores
      io.emit("respuestaJugador", { ...data, socketId: socket.id });
    });

    socket.on("disconnect", () => {
      console.log("❌ Usuario desconectado:", socket.id);
      // eliminar de waitingGames
      if (waitingGames["default"]) {
        waitingGames["default"].jugadores = waitingGames["default"].jugadores.filter(p => p.socketId !== socket.id);
        io.emit("jugadoresActualizados", waitingGames["default"].jugadores);
      }
    });
  });
};
