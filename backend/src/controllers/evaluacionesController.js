import {
  crearEvaluacionDesdeRegistro,
  listarEvaluacionesPorMadre,
  obtenerEvaluacionPorId,
  mapEvaluacionRow,
} from "../services/evaluacionService.js";
import { buildRegistroFromPayload } from "../utils/formatRegistro.js";

export const listarMisEvaluaciones = async (req, res) => {
  try {
    const rows = await listarEvaluacionesPorMadre(req.user.id);
    return res.json({
      total: rows.length,
      evaluaciones: rows.map(mapEvaluacionRow),
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al listar evaluaciones.",
      error: error.message,
    });
  }
};

export const obtenerMiEvaluacion = async (req, res) => {
  try {
    const row = await obtenerEvaluacionPorId(req.user.id, req.params.id);
    if (!row) {
      return res.status(404).json({ mensaje: "Evaluación no encontrada." });
    }
    return res.json(mapEvaluacionRow(row));
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener la evaluación.",
      error: error.message,
    });
  }
};

export const crearEvaluacion = async (req, res) => {
  try {
    const { madre, bebe, datosClinicos } = req.body;
    if (!madre || !bebe || !datosClinicos) {
      return res.status(400).json({ mensaje: "Faltan datos para la evaluación." });
    }

    const { evaluacionId, resultadoRiesgo, bebeId } = await crearEvaluacionDesdeRegistro(
      req.user.id,
      madre,
      bebe,
      datosClinicos
    );

    const registro = buildRegistroFromPayload(madre, bebe, datosClinicos, resultadoRiesgo);

    return res.status(201).json({
      mensaje: "Evaluación registrada correctamente.",
      evaluacionId,
      bebeId,
      resultadoRiesgo,
      registro,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear la evaluación.",
      error: error.message,
    });
  }
};
