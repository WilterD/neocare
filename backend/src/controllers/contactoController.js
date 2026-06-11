import { query } from "../db.js";

export const enviarMensaje = async (req, res) => {
  try {
    const { nombre, correo, telefono, asunto, mensaje } = req.body;

    if (!nombre?.trim() || !correo?.trim() || !asunto?.trim() || !mensaje?.trim()) {
      return res.status(400).json({
        mensaje: "Nombre, correo, asunto y mensaje son obligatorios.",
      });
    }

    await query(
      `INSERT INTO contacto_mensajes (nombre, correo, telefono, asunto, mensaje)
       VALUES ($1, $2, $3, $4, $5)`,
      [nombre.trim(), correo.trim().toLowerCase(), telefono?.trim() || null, asunto, mensaje.trim()]
    );

    return res.status(201).json({
      mensaje: "Mensaje enviado correctamente. Nos pondremos en contacto contigo.",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al enviar el mensaje.",
      error: error.message,
    });
  }
};
