import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  listarBebes,
  obtenerBebeDetalle,
  obtenerTriajeBebe,
  obtenerSeguimientoBebe,
  obtenerVacunasControlesBebe,
  obtenerModuloEducativoCompleto,
  guardarTriajeBebe,
  guardarSeguimientoBebe,
  guardarControlBebe,
  actualizarEstadoVacuna,
} from "../controllers/bebesController.js";

const router = Router();

router.get("/bebes", authRequired, listarBebes);
router.get("/bebes/:id", authRequired, obtenerBebeDetalle);
router.get("/bebes/:id/triaje", authRequired, obtenerTriajeBebe);
router.get("/bebes/:id/seguimiento", authRequired, obtenerSeguimientoBebe);
router.get("/bebes/:id/vacunas-controles", authRequired, obtenerVacunasControlesBebe);
router.get("/bebes/:id/modulo-educativo", authRequired, obtenerModuloEducativoCompleto);

router.post("/bebes/:id/triaje", authRequired, guardarTriajeBebe);
router.post("/bebes/:id/seguimiento", authRequired, guardarSeguimientoBebe);
router.post("/bebes/:id/controles", authRequired, guardarControlBebe);
router.post("/bebes/:id/vacunas", authRequired, actualizarEstadoVacuna);

export default router;
