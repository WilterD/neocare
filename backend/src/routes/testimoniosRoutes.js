import { Router } from "express";
import { listarTestimonios } from "../controllers/testimoniosController.js";

const router = Router();

router.get("/testimonios", listarTestimonios);

export default router;
