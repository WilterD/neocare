import { query } from "../db.js";

export const enviarContacto = async (req, res) => {
  try {
    const { nombre, correo, telefono, asunto, mensaje } = req.body;

    if (!nombre || !correo || !asunto || !mensaje) {
      return res.status(400).json({
        mensaje: "Nombre, correo, asunto y mensaje son obligatorios.",
      });
    }

    const sql = `
      INSERT INTO contacto_mensajes (nombre, correo, telefono, asunto, mensaje)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const { rows } = await query(sql, [
      nombre.trim(),
      correo.trim().toLowerCase(),
      telefono ? String(telefono).replace(/\D/g, "") : null,
      asunto,
      mensaje.trim(),
    ]);

    return res.status(201).json({
      mensaje: "Mensaje enviado correctamente. Nos pondremos en contacto contigo.",
      id: rows[0]?.id,
    });
  } catch (error) {
    console.error("Error en contacto:", error);
    return res.status(500).json({
      mensaje: "Error al enviar el mensaje.",
      error: error.message,
    });
  }
};
