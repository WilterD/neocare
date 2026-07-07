import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  listarBitacoraEmocional,
  crearBitacoraEmocional,
  listarEpds,
  crearEpds,
} from "../controllers/emocionalController.js";

const router = Router();

router.get("/emocional/diario", authRequired, listarBitacoraEmocional);
router.post("/emocional/diario", authRequired, crearBitacoraEmocional);
router.get("/emocional/epds", authRequired, listarEpds);
router.post("/emocional/epds", authRequired, crearEpds);

export default router;
