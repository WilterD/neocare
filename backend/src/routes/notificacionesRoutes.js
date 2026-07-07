import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  listarNotificaciones,
  marcarNotificacionLeida,
  crearNotificacion,
} from "../controllers/notificacionesController.js";

const router = Router();

router.get("/notificaciones", authRequired, listarNotificaciones);
router.post("/notificaciones", authRequired, crearNotificacion);
router.put("/notificaciones/:id/leida", authRequired, marcarNotificacionLeida);

export default router;
