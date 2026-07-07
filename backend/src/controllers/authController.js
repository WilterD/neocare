import crypto from "crypto";
import bcrypt from "bcryptjs";
import { query } from "../db.js";

export const solicitarReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ mensaje: "El correo es obligatorio." });
    }

    const { rows } = await query(
      "SELECT id FROM madres_cuidadores WHERE correo_electronico = $1",
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        mensaje: "No encontramos una cuenta con ese correo.",
      });
    }

    const madreId = rows[0].id;
    const token = crypto.randomUUID();
    const expira = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await query(
      "INSERT INTO password_reset_tokens (madre_id, token, expira_en, usado) VALUES ($1, $2, $3, 0)",
      [madreId, token, expira]
    );

    return res.json({
      mensaje: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña.",
      tokenDev: process.env.NODE_ENV === "production" ? undefined : token,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al solicitar restablecimiento.",
      error: error.message,
    });
  }
};

export const restablecerContrasena = async (req, res) => {
  try {
    const { token, contrasenaNueva } = req.body;
    if (!token || !contrasenaNueva) {
      return res.status(400).json({
        mensaje: "Token y contraseña nueva son obligatorios.",
      });
    }

    const { rows } = await query(
      `SELECT * FROM password_reset_tokens
       WHERE token = $1 AND usado = 0 AND datetime(expira_en) > datetime('now')`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ mensaje: "Token inválido o expirado." });
    }

    const resetRow = rows[0];
    const hash = await bcrypt.hash(contrasenaNueva, 10);

    await query(
      "UPDATE madres_cuidadores SET contrasena_hash = $1, actualizado_en = CURRENT_TIMESTAMP WHERE id = $2",
      [hash, resetRow.madre_id]
    );
    await query("UPDATE password_reset_tokens SET usado = 1 WHERE id = $1", [
      resetRow.id,
    ]);

    return res.json({ mensaje: "Contraseña restablecida correctamente." });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al restablecer contraseña.",
      error: error.message,
    });
  }
};
