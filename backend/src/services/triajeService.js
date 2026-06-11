import { query } from "../db.js";
import { crearNotificacion } from "./notificacionesService.js";

const SIGNOS = [
  { key: "convulsiones", pts: 3 },
  { key: "dificultad_respiratoria", pts: 3 },
  { key: "coloracion_azulada", pts: 3 },
  { key: "fiebre_hipotermia", pts: 3 },
  { key: "rechazo_alimentacion", pts: 3 },
  { key: "disminucion_conciencia", pts: 3 },
  { key: "vomitos_repetitivos", pts: 2 },
  { key: "ictericia_progresiva", pts: 2 },
  { key: "disminucion_actividad", pts: 2 },
  { key: "llanto_persistente", pts: 2 },
  { key: "alteraciones_sueno", pts: 1 },
  { key: "disminucion_apetito", pts: 1 },
  { key: "irritabilidad_ocasional", pts: 1 },
];

export const calcularTriaje = (signos) => {
  let total = 0;
  for (const s of SIGNOS) {
    if (signos[s.key]) total += s.pts;
  }
  let nivel = "Bajo";
  if (total >= 6) nivel = "Alto";
  else if (total >= 3) nivel = "Moderado";
  return { puntuacion_total: total, nivel_riesgo: nivel };
};

export const guardarTriaje = async (madreId, bebeId, signos) => {
  const { puntuacion_total, nivel_riesgo } = calcularTriaje(signos);
  const vals = SIGNOS.map((s) => (signos[s.key] ? 1 : 0));

  const res = await query(
    `INSERT INTO evaluaciones_riesgo_bebe (
      bebe_id, madre_id, convulsiones, dificultad_respiratoria, coloracion_azulada,
      fiebre_hipotermia, rechazo_alimentacion, disminucion_conciencia,
      vomitos_repetitivos, ictericia_progresiva, disminucion_actividad, llanto_persistente,
      alteraciones_sueno, disminucion_apetito, irritabilidad_ocasional,
      puntuacion_total, nivel_riesgo
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING id`,
    [bebeId, madreId, ...vals, puntuacion_total, nivel_riesgo]
  );

  const id = res.rows[0]?.id;
  if (nivel_riesgo === "Alto") {
    await crearNotificacion({
      madreId,
      bebeId,
      tipoAlerta: "Reevaluacion Triaje",
      mensaje: "Triaje con riesgo ALTO detectado. Busca atención médica de inmediato.",
    });
  }

  return { id, puntuacion_total, nivel_riesgo };
};

export const historialTriaje = async (bebeId) => {
  const res = await query(
    `SELECT * FROM evaluaciones_riesgo_bebe WHERE bebe_id = $1 ORDER BY fecha_evaluacion DESC`,
    [bebeId]
  );
  return res.rows;
};
