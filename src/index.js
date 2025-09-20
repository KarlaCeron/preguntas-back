// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { gameSocket } from "./socket/gameSocket.js";

dotenv.config();
const app = express();
const server = createServer(app);

const FRONT_URLS = [
  "http://localhost:5174", // web
  "http://localhost:5173", // movil simulated
  "http://localhost:3000",
];

// ⚡ Configurar CORS para Web y Móvil
const io = new Server(server, {
  cors: {
    origin: FRONT_URLS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true,
}));

app.use(express.json());

// 👉 Rutas REST
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("API Preguntados lista 🚀"));

// 👉 Sockets centralizados
gameSocket(io);

// 🚀 Conectar BD y arrancar servidor
const PORT = process.env.PORT || 4000;

server.listen(PORT, async () => {
  await connectDB(); // 👈 conecta aquí
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
