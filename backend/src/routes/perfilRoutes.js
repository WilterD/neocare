import { Router } from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  obtenerPerfil,
  actualizarPerfil,
  cambiarContrasena,
} from "../controllers/perfilController.js";

const router = Router();

router.get("/perfil/me", authRequired, obtenerPerfil);
router.put("/perfil/me", authRequired, actualizarPerfil);
router.put("/perfil/contrasena", authRequired, cambiarContrasena);

export default router;
