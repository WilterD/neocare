import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  listarMisEvaluaciones,
  crearEvaluacion,
} from "../controllers/evaluacionesController.js";

const router = Router();

router.get("/evaluaciones/mis", authRequired, listarMisEvaluaciones);
router.post("/evaluaciones", authRequired, crearEvaluacion);

export default router;
