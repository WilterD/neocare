import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  postTriaje, getTriajeHistorial, postSeguimiento, getSeguimiento,
  postBitacoraBebe, getBitacoraBebe, getVacunas, patchVacuna,
  getControles, postControl, postDatosClinicos, getDatosClinicos,
} from "../controllers/clinicoController.js";

const router = Router();

router.post("/triaje", authMiddleware, postTriaje);
router.get("/triaje/bebe/:bebeId", authMiddleware, getTriajeHistorial);
router.post("/seguimiento", authMiddleware, postSeguimiento);
router.get("/seguimiento/bebe/:bebeId", authMiddleware, getSeguimiento);
router.post("/bitacora-bebe", authMiddleware, postBitacoraBebe);
router.get("/bitacora-bebe/:bebeId", authMiddleware, getBitacoraBebe);
router.get("/vacunas/:bebeId", authMiddleware, getVacunas);
router.patch("/vacunas/:bebeId/:vacunaId", authMiddleware, patchVacuna);
router.get("/controles/:bebeId", authMiddleware, getControles);
router.post("/controles/:bebeId", authMiddleware, postControl);
router.post("/datos-clinicos", authMiddleware, postDatosClinicos);
router.get("/datos-clinicos/bebe/:bebeId", authMiddleware, getDatosClinicos);

export default router;
