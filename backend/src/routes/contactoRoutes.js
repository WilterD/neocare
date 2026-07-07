import { Router } from "express";
import { enviarContacto } from "../controllers/contactoController.js";

const router = Router();

router.post("/contacto", enviarContacto);

export default router;
