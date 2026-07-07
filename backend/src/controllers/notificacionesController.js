import { query } from "../db.js";

export const listarNotificaciones = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM notificaciones_alertas
       WHERE madre_id = $1
       ORDER BY fecha_envio DESC`,
      [req.user.id]
    );
    return res.json({ total: rows.length, notificaciones: rows });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener notificaciones.",
      error: error.message,
    });
  }
};

export const marcarNotificacionLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      "SELECT id FROM notificaciones_alertas WHERE id = $1 AND madre_id = $2",
      [id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Notificación no encontrada." });
    }

    await query(
      "UPDATE notificaciones_alertas SET leido = 1 WHERE id = $1",
      [id]
    );

    return res.json({ mensaje: "Notificación marcada como leída." });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar notificación.",
      error: error.message,
    });
  }
};

export const crearNotificacion = async (req, res) => {
  try {
    const { bebeId, tipoAlerta, mensaje } = req.body;
    if (!tipoAlerta || !mensaje) {
      return res.status(400).json({
        mensaje: "tipoAlerta y mensaje son obligatorios.",
      });
    }

    const sql = `
      INSERT INTO notificaciones_alertas (madre_id, bebe_id, tipo_alerta, mensaje, leido)
      VALUES ($1, $2, $3, $4, 0)
      RETURNING id
    `;

    const { rows } = await query(sql, [
      req.user.id,
      bebeId || null,
      tipoAlerta,
      mensaje,
    ]);

    return res.status(201).json({
      mensaje: "Notificación creada.",
      id: rows[0]?.id,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear notificación.",
      error: error.message,
    });
  }
};
