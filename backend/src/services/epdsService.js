import { query } from "../db.js";
import { crearNotificacion } from "./notificacionesService.js";

export const clasificarEpds = (total) => {
  if (total < 10) return "Bajo";
  if (total <= 12) return "Posible";
  return "Probable";
};

export const guardarEpds = async (madreId, respuestas) => {
  const keys = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
  const vals = keys.map((k) => {
    const v = Number(respuestas[k]);
    if (v < 0 || v > 3) throw new Error(`Respuesta inválida en ${k}`);
    return v;
  });
  const total = vals.reduce((a, b) => a + b, 0);
  const clasificacion = clasificarEpds(total);

  const res = await query(
    `INSERT INTO evaluaciones_epds (madre_id, p1,p2,p3,p4,p5,p6,p7,p8,p9,p10, puntuacion_total, clasificacion)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
    [madreId, ...vals, total, clasificacion]
  );

  if (clasificacion === "Probable") {
    await crearNotificacion({
      madreId,
      tipoAlerta: "Educativa",
      mensaje: "Tu evaluación EPDS sugiere posible depresión posparto. Consulta con un profesional de salud.",
    });
  }

  return { id: res.rows[0]?.id, puntuacion_total: total, clasificacion };
};

export const historialEpds = async (madreId) => {
  const res = await query(
    `SELECT id, fecha_evaluacion, puntuacion_total, clasificacion FROM evaluaciones_epds
     WHERE madre_id = $1 ORDER BY fecha_evaluacion DESC`,
    [madreId]
  );
  return res.rows;
};
