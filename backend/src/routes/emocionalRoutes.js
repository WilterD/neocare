import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  postDiario, getDiarioMe, getDiarioPromedio, getDiarioEstado,
  postEpds, getEpdsMe, getTestimonios,
} from "../controllers/emocionalController.js";

const router = Router();

router.post("/diario-emocional", authMiddleware, postDiario);
router.get("/diario-emocional/me", authMiddleware, getDiarioMe);
router.get("/diario-emocional/me/promedio", authMiddleware, getDiarioPromedio);
router.get("/diario-emocional/me/estado", authMiddleware, getDiarioEstado);
router.post("/epds", authMiddleware, postEpds);
router.get("/epds/me", authMiddleware, getEpdsMe);
router.get("/testimonios", getTestimonios);

export default router;
