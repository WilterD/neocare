import { Router } from "express";
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

// Rutas de lectura (GET)
router.get("/bebes", listarBebes);
router.get("/bebes/:id", obtenerBebeDetalle);
router.get("/bebes/:id/triaje", obtenerTriajeBebe);
router.get("/bebes/:id/seguimiento", obtenerSeguimientoBebe);
router.get("/bebes/:id/vacunas-controles", obtenerVacunasControlesBebe);
router.get("/bebes/:id/modulo-educativo", obtenerModuloEducativoCompleto);

// Rutas de escritura (POST / PUT)
router.post("/bebes/:id/triaje", guardarTriajeBebe);
router.post("/bebes/:id/seguimiento", guardarSeguimientoBebe);
router.post("/bebes/:id/controles", guardarControlBebe);
router.post("/bebes/:id/vacunas", actualizarEstadoVacuna);

export default router;
