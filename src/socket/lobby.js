let jugadores = [];

export const lobbyHandler = (io, socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("registrarJugador", (nombre) => {
    if (jugadores.length < 5) {
      const jugador = { id: socket.id, nombre };
      jugadores.push(jugador);

      io.emit("jugadoresActualizados", jugadores);

      if (jugadores.length === 5) {
        io.emit("iniciarJuego");
      }
    } else {
      socket.emit("lobbyLleno", "El lobby ya tiene 5 jugadores");
    }
  });

  socket.on("disconnect", () => {
    jugadores = jugadores.filter((j) => j.id !== socket.id);
    io.emit("jugadoresActualizados", jugadores);
  });
};
