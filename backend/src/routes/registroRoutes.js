import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  crearRegistro,
  loginUsuario,
  obtenerRegistroPorId
} from "../controllers/registroController.js";

const router = Router();

router.post("/registro", crearRegistro);
router.post("/login", loginUsuario);
router.get("/registros/:id", authMiddleware, obtenerRegistroPorId);

export default router;