import { Router } from "express";
import {
  crearRegistro,
  loginUsuario,
  obtenerRegistros,
  obtenerRegistroPorId
} from "../controllers/registroController.js";

const router = Router();

router.post("/registro", crearRegistro);
router.post("/login", loginUsuario);
router.get("/registros", obtenerRegistros);
router.get("/registros/:id", obtenerRegistroPorId);

export default router;