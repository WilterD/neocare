import { Router } from "express";
import { enviarMensaje } from "../controllers/contactoController.js";

const router = Router();

router.post("/contacto", enviarMensaje);

export default router;
