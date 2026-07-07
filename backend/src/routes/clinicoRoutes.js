import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  listarBitacoraBebe,
  crearBitacoraBebe,
  crearBebe,
} from "../controllers/clinicoController.js";

const router = Router();

router.post("/bebes/nuevo", authRequired, crearBebe);
router.get("/bebes/:id/bitacora", authRequired, listarBitacoraBebe);
router.post("/bebes/:id/bitacora", authRequired, crearBitacoraBebe);

export default router;
