import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  listarMisEvaluaciones,
  obtenerMiEvaluacion,
  crearEvaluacion,
} from "../controllers/evaluacionesController.js";

const router = Router();

router.get("/evaluaciones", authMiddleware, listarMisEvaluaciones);
router.get("/evaluaciones/:id", authMiddleware, obtenerMiEvaluacion);
router.post("/evaluaciones", authMiddleware, crearEvaluacion);

export default router;
