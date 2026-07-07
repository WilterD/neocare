import { query } from "../db.js";
import {
  listarCatalogoSignos,
  TRIAGE_META,
} from "../services/triajeEducativoService.js";
import { SEGUIMIENTO_META } from "../services/seguimientoService.js";
import { VACUNAS_META } from "../services/vacunasControlesService.js";

export const listarContenidoEducativo = async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, titulo, tema, descripcion, recomendacion, nivel_alerta, url_recurso, fuente_referencia FROM biblioteca_educativa ORDER BY id ASC"
    );
    return res.json({ total: rows.length, contenidos: rows });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener contenido educativo.",
      error: error.message,
    });
  }
};

export const obtenerContenidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      "SELECT * FROM biblioteca_educativa WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Contenido no encontrado." });
    }
    return res.json({ contenido: rows[0] });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener contenido.",
      error: error.message,
    });
  }
};

export const obtenerMetaTriaje = async (_req, res) => {
  return res.json({
    meta: TRIAGE_META,
    catalogoSignos: listarCatalogoSignos(),
  });
};

export const obtenerMetaSeguimiento = async (_req, res) => {
  return res.json({ meta: SEGUIMIENTO_META });
};

export const obtenerMetaVacunas = async (_req, res) => {
  return res.json({ meta: VACUNAS_META });
};
