let jugadores = [];

export const gameSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Usuario conectado:", socket.id);

    // 📌 Registrar jugador
    socket.on("registrarJugador", (nombre) => {
      if (jugadores.length < 5) {
        const jugador = { id: socket.id, nombre };
        jugadores.push(jugador);

        console.log("👤 Jugador registrado:", nombre);

        // 🔄 Emitir lista actualizada a todos
        io.emit("jugadoresActualizados", jugadores);

        // 🚀 Si ya hay 5 jugadores, iniciar juego
        if (jugadores.length === 5) {
          io.emit("iniciarJuego");
        }
      } else {
        // ❌ Lobby lleno
        socket.emit("lobbyLleno", "El lobby ya tiene 5 jugadores");
      }
    });

    // 📌 Desconexión
    socket.on("disconnect", () => {
      console.log("❌ Usuario desconectado:", socket.id);
      jugadores = jugadores.filter((j) => j.id !== socket.id);

      // 🔄 Actualizar lista
      io.emit("jugadoresActualizados", jugadores);
    });
  });
};