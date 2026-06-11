import { Router } from "express";
import passport from "passport";
import { googleCallback, forgotPassword, resetPassword } from "../auth/authController.js";

const router = Router();

router.get(
  "/auth/google",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ mensaje: "Google OAuth no configurado en el servidor." });
    }
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/failure" }),
  googleCallback
);

router.get("/auth/google/failure", (_req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=oauth`);
});

router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);

export default router;
