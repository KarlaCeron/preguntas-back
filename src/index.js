import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { preguntas } from "./data/preguntas.js";
import authRoutes from "./routes/authRoutes.js";
import { gameSocket } from "./socket/gameSocket.js"; // 👈 importamos lógica de sockets

dotenv.config();
const app = express();
const server = createServer(app);

// ⚡ Configura CORS explícito para frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// 👉 Rutas REST
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API de Preguntados lista 🚀");
});

app.get("/preguntas", (req, res) => {
  const sanitized = preguntas.map(({ answer, question, ...rest }) => ({
    preguntas: question,
    ...rest,
  }));
  res.json(sanitized);
});

// 👉 Sockets centralizados en gameSocket.js
gameSocket(io);

// 🚀 Conectar BD y arrancar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
  await connectDB();
  console.log(`Servidor corriendo en puerto ${PORT}`);
});