import { query } from "../db.js";

const hoyLocal = () => new Date().toISOString().slice(0, 10);

export const crearRegistro = async (madreId, { puntaje, nota, nivelAnimo, nivelAnsiedad, nivelCansancio }) => {
  const fecha = hoyLocal();
  const existente = await query(
    `SELECT id FROM bitacora_emocional WHERE madre_id = $1 AND date(fecha_registro) = $2`,
    [madreId, fecha]
  );
  if (existente.rows.length > 0) {
    const err = new Error("Ya completaste el check-in de hoy.");
    err.status = 409;
    throw err;
  }

  const animo = nivelAnimo ?? Math.min(5, Math.ceil(puntaje / 2));
  const ansiedad = nivelAnsiedad ?? Math.max(1, 6 - Math.ceil(puntaje / 2));
  const cansancio = nivelCansancio ?? Math.max(1, 6 - Math.ceil(puntaje / 2));

  await query(
    `INSERT INTO bitacora_emocional (madre_id, nivel_animo, nivel_ansiedad, nivel_cansancio, puntaje_simple, nota_diaria)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [madreId, animo, ansiedad, cansancio, puntaje, nota || null]
  );

  await query(
    `UPDATE madres_cuidadores SET ultimo_checkin_emocional = CURRENT_TIMESTAMP WHERE id = $1`,
    [madreId]
  );
};

export const listarRegistros = async (madreId) => {
  const res = await query(
    `SELECT * FROM bitacora_emocional WHERE madre_id = $1 ORDER BY fecha_registro DESC LIMIT 30`,
    [madreId]
  );
  return res.rows;
};

export const promedioSemanal = async (madreId) => {
  const res = await query(
    `SELECT AVG(puntaje_simple) as promedio, COUNT(*) as total
     FROM bitacora_emocional WHERE madre_id = $1 AND fecha_registro >= datetime('now', '-7 days')`,
    [madreId]
  );
  return {
    promedio: Number(res.rows[0]?.promedio?.toFixed?.(1) ?? res.rows[0]?.promedio ?? 0),
    total: Number(res.rows[0]?.total ?? 0),
  };
};

export const estadoDelDia = async (madreId) => {
  const fecha = hoyLocal();
  const res = await query(
    `SELECT * FROM bitacora_emocional WHERE madre_id = $1 AND date(fecha_registro) = $2`,
    [madreId, fecha]
  );
  return { yaCompletadoHoy: res.rows.length > 0, ultimoRegistro: res.rows[0] || null };
};
