import { Router } from "express";
import {
  listarContenidoEducativo,
  obtenerContenidoPorId,
  obtenerMetaTriaje,
  obtenerMetaSeguimiento,
  obtenerMetaVacunas,
} from "../controllers/educacionController.js";

const router = Router();

router.get("/educacion/meta/triaje", obtenerMetaTriaje);
router.get("/educacion/meta/seguimiento", obtenerMetaSeguimiento);
router.get("/educacion/meta/vacunas", obtenerMetaVacunas);
router.get("/educacion", listarContenidoEducativo);
router.get("/educacion/:id", obtenerContenidoPorId);

export default router;
