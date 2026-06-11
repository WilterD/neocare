import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getNotificaciones, patchNotificacionLeida } from "../controllers/notificacionesController.js";

const router = Router();
router.get("/notificaciones", authMiddleware, getNotificaciones);
router.patch("/notificaciones/:id/leer", authMiddleware, patchNotificacionLeida);
export default router;
