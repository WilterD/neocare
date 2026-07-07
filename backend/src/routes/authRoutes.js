import { Router } from "express";
import { solicitarReset, restablecerContrasena } from "../controllers/authController.js";

const router = Router();

router.post("/auth/forgot-password", solicitarReset);
router.post("/auth/reset-password", restablecerContrasena);

export default router;
