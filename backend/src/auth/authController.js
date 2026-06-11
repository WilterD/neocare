import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { query } from "../db.js";
import { signTokenForMadre } from "./passport.js";

const getTransporter = () => {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
};

export const googleCallback = async (req, res) => {
  try {
    const { token, usuario } = await signTokenForMadre(req.user.madreId);
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontend}/auth/callback?token=${encodeURIComponent(token)}&nombre=${encodeURIComponent(usuario.nombre)}`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=oauth`);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ mensaje: "Correo requerido." });

    const madreRes = await query("SELECT id, nombre FROM madres_cuidadores WHERE correo_electronico = $1", [email.trim().toLowerCase()]);
    if (madreRes.rows.length === 0) {
      return res.json({ mensaje: "Si el correo existe, recibirás instrucciones." });
    }

    const madre = madreRes.rows[0];
    if (!madre) return res.json({ mensaje: "Si el correo existe, recibirás instrucciones." });

    const token = uuidv4();
    const expira = new Date(Date.now() + 3600000).toISOString();
    await query(
      "INSERT INTO password_reset_tokens (madre_id, token, expira_en) VALUES ($1, $2, $3)",
      [madre.id, token, expira]
    );

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const link = `${frontend}/restablecer-contrasena?token=${token}`;
    const transporter = getTransporter();

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "neocare@localhost",
        to: email,
        subject: "Restablecer contraseña NeoCare",
        text: `Hola ${madre.nombre}, usa este enlace para restablecer tu contraseña: ${link}`,
      });
    } else {
      console.log(`[DEV] Reset link: ${link}`);
    }

    return res.json({
      mensaje: "Si el correo existe, recibirás instrucciones.",
      ...(process.env.NODE_ENV !== "production" && !transporter ? { devLink: link } : {}),
    });
  } catch (err) {
    return res.status(500).json({ mensaje: "Error al procesar solicitud.", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 6) {
      return res.status(400).json({ mensaje: "Token y contraseña válida requeridos." });
    }

    const tokRes = await query(
      `SELECT * FROM password_reset_tokens WHERE token = $1 AND usado = 0 AND expira_en > datetime('now')`,
      [token]
    );
    if (tokRes.rows.length === 0) {
      return res.status(400).json({ mensaje: "Token inválido o expirado." });
    }

    const row = tokRes.rows[0];
    const hash = await bcrypt.hash(password, 10);
    await query("UPDATE madres_cuidadores SET contrasena_hash = $1, oauth_only = 0 WHERE id = $2", [hash, row.madre_id]);
    await query("UPDATE password_reset_tokens SET usado = 1 WHERE id = $1", [row.id]);

    return res.json({ mensaje: "Contraseña actualizada. Ya puedes iniciar sesión." });
  } catch (err) {
    return res.status(500).json({ mensaje: "Error al restablecer contraseña.", error: err.message });
  }
};
