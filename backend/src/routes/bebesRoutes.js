import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getBebes, getBebeById, postBebe, putBebe } from "../controllers/bebesController.js";

const router = Router();
router.get("/bebes", authMiddleware, getBebes);
router.post("/bebes", authMiddleware, postBebe);
router.get("/bebes/:id", authMiddleware, getBebeById);
router.put("/bebes/:id", authMiddleware, putBebe);
export default router;
