import * as diario from "../services/diarioEmocionalService.js";
import * as epds from "../services/epdsService.js";
import { query } from "../db.js";

export const postDiario = async (req, res) => {
  try {
    await diario.crearRegistro(req.user.id, req.body);
    return res.status(201).json({ mensaje: "Check-in registrado." });
  } catch (e) {
    return res.status(e.status || 500).json({ mensaje: e.message });
  }
};

export const getDiarioMe = async (req, res) => {
  const registros = await diario.listarRegistros(req.user.id);
  return res.json({ registros });
};

export const getDiarioPromedio = async (req, res) => {
  const data = await diario.promedioSemanal(req.user.id);
  return res.json(data);
};

export const getDiarioEstado = async (req, res) => {
  const data = await diario.estadoDelDia(req.user.id);
  return res.json(data);
};

export const postEpds = async (req, res) => {
  try {
    const r = await epds.guardarEpds(req.user.id, req.body);
    return res.status(201).json(r);
  } catch (e) {
    return res.status(400).json({ mensaje: e.message });
  }
};

export const getEpdsMe = async (req, res) => {
  const historial = await epds.historialEpds(req.user.id);
  return res.json({ historial });
};

export const getTestimonios = async (req, res) => {
  const { etapa } = req.query;
  let sql = "SELECT * FROM testimonios";
  const params = [];
  if (etapa) {
    sql += " WHERE etapa = $1";
    params.push(etapa);
  }
  sql += " ORDER BY id";
  const { rows } = await query(sql, params);
  return res.json({ testimonios: rows });
};
