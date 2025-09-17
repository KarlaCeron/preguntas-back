import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { preguntas } from "./data/preguntas.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// 👉 Lista de jugadores en memoria
let jugadores = [];

// Rutas básicas
app.get("/", (req, res) => {
  res.send("API de Preguntados lista 🚀");
});

// Ruta de preguntas
app.get("/preguntas", (req, res) => {
  const sanitized = preguntas.map(({ answer, pregunta, ...rest }) => ({
    preguntas: pregunta, // 👈 mantenemos la clave "preguntas"
    ...rest,
  }));
  res.json(sanitized);
});

// 🎮 Socket.IO
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Registrar jugador
  socket.on("registrarJugador", (nombre) => {
    if (jugadores.length < 5) {   // ✅ solo permitimos hasta 5
      const jugador = { id: socket.id, nombre };
      jugadores.push(jugador);

      // Emitir lista actualizada
      io.emit("jugadoresActualizados", jugadores);

      // 🚀 Si ya hay 5 jugadores, iniciar juego
      if (jugadores.length === 5) {
        io.emit("iniciarJuego");
      }
    } else {
      // ❌ Avisar al que intenta entrar cuando el lobby está lleno
      socket.emit("lobbyLleno", "El lobby ya tiene 5 jugadores");
    }
  });

  // Cuando un jugador se desconecta
  socket.on("disconnect", () => {
    jugadores = jugadores.filter((j) => j.id !== socket.id);
    io.emit("jugadoresActualizados", jugadores);
  });
});

// Conectar BD y arrancar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
  await connectDB();
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
