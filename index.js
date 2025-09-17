// index.js (backend)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { preguntas } from "./data/preguntas.js";
import authRutas from "./rutas/auth.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/auth", authRutas);

// Rutas básicas
app.get("/", (req, res) => {
  res.send("API de Preguntados lista 🚀");
});

app.get("/preguntas", (req, res) => {
  const sanitized = preguntas.map(({ answer, ...rest }) => ({
    question: rest.preguntas, // 👈 cambiamos a `question`
    category: rest.category,
    options: rest.options,
  }));
  res.json(sanitized);
});

// 🔹 Lista de jugadores en memoria
let jugadores = [];

// Socket.IO
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("registrarJugador", (nombre) => {
    const jugador = { id: socket.id, nombre };
    jugadores.push(jugador);

    // enviamos la lista actualizada a todos
    io.emit("jugadoresActualizados", jugadores);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
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