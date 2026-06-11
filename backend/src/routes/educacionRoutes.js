import { Router } from "express";
import { listarContenido, obtenerContenidoPorId } from "../controllers/educacionController.js";

const router = Router();

router.get("/contenido-educativo", listarContenido);
router.get("/contenido-educativo/:id", obtenerContenidoPorId);

export default router;
