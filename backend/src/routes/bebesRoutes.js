import { Router } from "express";
import {
  listarBebes,
  obtenerBebeDetalle,
  obtenerTriajeBebe,
  obtenerSeguimientoBebe,
  obtenerVacunasControlesBebe,
  obtenerModuloEducativoCompleto,
} from "../controllers/bebesController.js";

const router = Router();

router.get("/bebes", listarBebes);
router.get("/bebes/:id", obtenerBebeDetalle);
router.get("/bebes/:id/triaje", obtenerTriajeBebe);
router.get("/bebes/:id/seguimiento", obtenerSeguimientoBebe);
router.get("/bebes/:id/vacunas-controles", obtenerVacunasControlesBebe);
router.get("/bebes/:id/modulo-educativo", obtenerModuloEducativoCompleto);

export default router;
