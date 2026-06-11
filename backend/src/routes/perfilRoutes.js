import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getPerfilMe, putPerfilMe } from "../controllers/perfilController.js";

const router = Router();
router.get("/perfil/me", authMiddleware, getPerfilMe);
router.put("/perfil/me", authMiddleware, putPerfilMe);
export default router;
