import { query } from "../db.js";

export const crearNotificacion = async ({ madreId, bebeId, tipoAlerta, mensaje }) => {
  await query(
    `INSERT INTO notificaciones_alertas (madre_id, bebe_id, tipo_alerta, mensaje) VALUES ($1, $2, $3, $4)`,
    [madreId, bebeId || null, tipoAlerta, mensaje]
  );
};

export const listarNotificaciones = async (madreId) => {
  const res = await query(
    `SELECT * FROM notificaciones_alertas WHERE madre_id = $1 ORDER BY fecha_envio DESC LIMIT 50`,
    [madreId]
  );
  return res.rows;
};

export const contarNoLeidas = async (madreId) => {
  const res = await query(
    `SELECT COUNT(*) as c FROM notificaciones_alertas WHERE madre_id = $1 AND leido = 0`,
    [madreId]
  );
  return Number(res.rows[0]?.c ?? 0);
};

export const marcarLeida = async (madreId, id) => {
  await query(
    `UPDATE notificaciones_alertas SET leido = 1 WHERE id = $1 AND madre_id = $2`,
    [id, madreId]
  );
};
