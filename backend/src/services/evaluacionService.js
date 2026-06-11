import { query } from "../db.js";
import { evaluarRegistro } from "./riesgoService.js";

export const guardarEvaluacion = async (madreId, bebeId, resultadoRiesgo) => {
  const res = await query(
    `INSERT INTO evaluaciones_riesgo_registro (
      madre_id, bebe_id, puntaje_materno, clasificacion_materna,
      puntaje_neonatal, clasificacion_neonatal, clasificacion_final, recomendacion_seguimiento
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`,
    [
      madreId,
      bebeId,
      resultadoRiesgo.puntajeMaterno,
      resultadoRiesgo.clasificacionMaterna,
      resultadoRiesgo.puntajeNeonatal,
      resultadoRiesgo.clasificacionNeonatal,
      resultadoRiesgo.clasificacionFinal,
      resultadoRiesgo.recomendacionSeguimiento,
    ]
  );

  const id = res.rows[0]?.id ?? res.rows[0]?.insertId;
  return { id, ...resultadoRiesgo };
};

export const crearEvaluacionDesdeRegistro = async (madreId, madre, bebe, datosClinicos) => {
  const bebeRes = await query(
    "SELECT id FROM recien_nacidos WHERE madre_id = $1 ORDER BY id DESC LIMIT 1",
    [madreId]
  );
  const bebeId = bebeRes.rows[0]?.id;
  if (!bebeId) {
    throw new Error("No se encontró un recién nacido asociado.");
  }

  const resultadoRiesgo = evaluarRegistro({ madre, bebe, datosClinicos });
  const saved = await guardarEvaluacion(madreId, bebeId, resultadoRiesgo);
  return { evaluacionId: saved.id, resultadoRiesgo, bebeId };
};

export const listarEvaluacionesPorMadre = async (madreId) => {
  const res = await query(
    `SELECT e.*, r.nombre_bebe
     FROM evaluaciones_riesgo_registro e
     JOIN recien_nacidos r ON r.id = e.bebe_id
     WHERE e.madre_id = $1
     ORDER BY e.fecha_evaluacion DESC`,
    [madreId]
  );
  return res.rows;
};

export const obtenerEvaluacionPorId = async (madreId, evaluacionId) => {
  const res = await query(
    `SELECT e.*, r.nombre_bebe
     FROM evaluaciones_riesgo_registro e
     JOIN recien_nacidos r ON r.id = e.bebe_id
     WHERE e.id = $1 AND e.madre_id = $2`,
    [evaluacionId, madreId]
  );
  return res.rows[0] || null;
};

export const mapEvaluacionRow = (row) => ({
  id: row.id,
  madreId: row.madre_id,
  bebeId: row.bebe_id,
  nombreBebe: row.nombre_bebe,
  fechaEvaluacion: row.fecha_evaluacion,
  puntajeMaterno: row.puntaje_materno,
  clasificacionMaterna: row.clasificacion_materna,
  puntajeNeonatal: row.puntaje_neonatal,
  clasificacionNeonatal: row.clasificacion_neonatal,
  clasificacionFinal: row.clasificacion_final,
  recomendacionSeguimiento: row.recomendacion_seguimiento,
  resultadoRiesgo: {
    puntajeMaterno: row.puntaje_materno,
    clasificacionMaterna: row.clasificacion_materna,
    puntajeNeonatal: row.puntaje_neonatal,
    clasificacionNeonatal: row.clasificacion_neonatal,
    clasificacionFinal: row.clasificacion_final,
    recomendacionSeguimiento: row.recomendacion_seguimiento,
  },
});
