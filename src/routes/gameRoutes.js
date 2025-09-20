import express from "express";
import { crearPartida, listarPreguntas, guardarResultadoPartida } from "../controllers/gameController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/crear", protect, crearPartida);
router.get("/preguntas", protect, listarPreguntas);
router.post("/guardar-resultados", protect, guardarResultadoPartida);

export default router;
