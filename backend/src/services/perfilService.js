import { query } from "../db.js";
import { formatRegistroFromDb } from "../utils/formatRegistro.js";

export const obtenerPerfilCompleto = async (madreId) => {
  const madreRes = await query("SELECT * FROM madres_cuidadores WHERE id = $1", [madreId]);
  const madre = madreRes.rows[0];
  if (!madre) return null;

  const bebesRes = await query("SELECT * FROM recien_nacidos WHERE madre_id = $1 ORDER BY id", [madreId]);
  const bebes = bebesRes.rows;

  const evalRes = await query(
    `SELECT * FROM evaluaciones_riesgo_registro WHERE madre_id = $1 ORDER BY fecha_evaluacion DESC LIMIT 1`,
    [madreId]
  );
  const ultimaEvaluacion = evalRes.rows[0] || null;

  const bebe = bebes[bebes.length - 1] || null;
  const registro = formatRegistroFromDb(madre, bebe);

  if (ultimaEvaluacion) {
    registro.resultadoRiesgo = {
      puntajeMaterno: ultimaEvaluacion.puntaje_materno,
      clasificacionMaterna: ultimaEvaluacion.clasificacion_materna,
      puntajeNeonatal: ultimaEvaluacion.puntaje_neonatal,
      clasificacionNeonatal: ultimaEvaluacion.clasificacion_neonatal,
      clasificacionFinal: ultimaEvaluacion.clasificacion_final,
      recomendacionSeguimiento: ultimaEvaluacion.recomendacion_seguimiento,
    };
    registro.evaluacionId = ultimaEvaluacion.id;
    registro.fechaUltimaEvaluacion = ultimaEvaluacion.fecha_evaluacion;
  }

  return {
    madre,
    bebes,
    registro,
    ultimaEvaluacion,
  };
};

export const actualizarPerfil = async (madreId, datos) => {
  const bool = (v) => (v === "Sí" || v === true ? 1 : 0);
  const sets = [];
  const vals = [];

  const add = (col, val) => {
    sets.push(`${col} = $${sets.length + 1}`);
    vals.push(val);
  };

  if (datos.nombre !== undefined) add("nombre", datos.nombre);
  if (datos.edad !== undefined) add("edad", Number(datos.edad));
  if (datos.telefono !== undefined) add("telefono", datos.telefono);
  if (datos.nivelEducativo !== undefined) add("nivel_educacion", datos.nivelEducativo);
  if (datos.zonaResidencia !== undefined) add("zona_residencia", datos.zonaResidencia);
  if (datos.accesoCentroSalud !== undefined) add("acceso_centro_salud", bool(datos.accesoCentroSalud));
  if (datos.situacionEconomica !== undefined) add("situacion_economica", datos.situacionEconomica);
  if (datos.numeroNinosCuidado !== undefined) {
    add("numero_hijos", Number(datos.numeroNinosCuidado));
    add("tiene_dos_o_mas_hijos", Number(datos.numeroNinosCuidado) >= 2 ? 1 : 0);
  }
  if (datos.cuidaSinApoyo !== undefined) add("es_madre_sola", bool(datos.cuidaSinApoyo));
  if (datos.apoyoFamiliar !== undefined) add("tiene_apoyo_familiar", bool(datos.apoyoFamiliar));
  if (datos.apoyoPrincipal !== undefined) add("apoyo_principal", datos.apoyoPrincipal);
  if (datos.primeraVezCuidando !== undefined) add("es_madre_primeriza", bool(datos.primeraVezCuidando));

  if (sets.length === 0) return;

  vals.push(madreId);
  await query(
    `UPDATE madres_cuidadores SET ${sets.join(", ")}, actualizado_en = CURRENT_TIMESTAMP WHERE id = $${vals.length}`,
    vals
  );
};
