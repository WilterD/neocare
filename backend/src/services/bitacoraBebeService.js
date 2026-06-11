import { query } from "../db.js";

export const guardarRegistro = async (madreId, bebeId, tipoRegistro, detalles, observaciones) => {
  await query(
    `INSERT INTO bitacora_cuidado_bebe (bebe_id, madre_id, tipo_registro, detalles, observaciones)
     VALUES ($1, $2, $3, $4, $5)`,
    [bebeId, madreId, tipoRegistro, JSON.stringify(detalles), observaciones || null]
  );
};

export const listarRegistros = async (bebeId) => {
  const res = await query(
    `SELECT * FROM bitacora_cuidado_bebe WHERE bebe_id = $1 ORDER BY fecha_registro DESC LIMIT 100`,
    [bebeId]
  );
  return res.rows.map((r) => ({
    ...r,
    detalles: typeof r.detalles === "string" ? JSON.parse(r.detalles) : r.detalles,
  }));
};
