import { query } from "../db.js";
import { crearNotificacion } from "./notificacionesService.js";

const ESCALAS = ["Mejoró", "Igual", "Empeoró", "Sí", "No"];

const calcularSemaforo = (respuestas) => {
  const alarmas = [
    respuestas.alarma_convulsiones,
    respuestas.alarma_vomito,
    respuestas.alarma_empeoramiento,
    respuestas.alimentacion_rechazo,
    respuestas.respiracion_dificultad,
  ];
  if (alarmas.some((r) => r === "Empeoró" || r === "Sí")) return "Rojo";
  const empeoro = Object.values(respuestas).filter((r) => r === "Empeoró").length;
  if (empeoro >= 2) return "Amarillo";
  return "Verde";
};

export const guardarSeguimiento = async (madreId, bebeId, evaluacionRiesgoId, dia, respuestas) => {
  const resultado = calcularSemaforo(respuestas);
  const campos = [
    "alimentacion_normal", "alimentacion_rechazo", "temperatura_fiebre", "temperatura_frio",
    "actividad_normal", "actividad_letargo", "respiracion_normal", "respiracion_dificultad",
    "piel_normal", "piel_alteracion", "eliminacion_panales", "eliminacion_deposiciones",
    "llanto_normal", "llanto_alteracion", "alarma_convulsiones", "alarma_vomito", "alarma_empeoramiento",
  ];

  const vals = campos.map((c) => respuestas[c] || "Igual");

  try {
    await query(
      `INSERT INTO seguimiento_diario_neonato (
        bebe_id, madre_id, evaluacion_riesgo_id, dia_seguimiento,
        ${campos.join(", ")}, resultado_evolucion
      ) VALUES ($1,$2,$3,$4,${campos.map((_, i) => `$${i + 5}`).join(",")}, $${campos.length + 5})`,
      [bebeId, madreId, evaluacionRiesgoId, dia, ...vals, resultado]
    );
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw new Error("Ya registraste el seguimiento de este día.");
    }
    throw err;
  }

  if (resultado === "Rojo") {
    await crearNotificacion({
      madreId,
      bebeId,
      tipoAlerta: "Seguimiento Diario",
      mensaje: `Día ${dia}: evolución ROJA. Acude al centro de salud.`,
    });
  }

  return { dia, resultado_evolucion: resultado };
};

export const progresoSeguimiento = async (bebeId, evaluacionRiesgoId) => {
  const res = await query(
    `SELECT * FROM seguimiento_diario_neonato WHERE bebe_id = $1 AND evaluacion_riesgo_id = $2 ORDER BY dia_seguimiento`,
    [bebeId, evaluacionRiesgoId]
  );
  return res.rows;
};

export { ESCALAS };
