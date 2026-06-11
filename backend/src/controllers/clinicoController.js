import { verificarBebeDeMadre } from "../utils/ownership.js";
import { guardarTriaje, historialTriaje } from "../services/triajeService.js";
import { guardarSeguimiento, progresoSeguimiento } from "../services/seguimientoService.js";
import { guardarRegistro, listarRegistros } from "../services/bitacoraBebeService.js";
import { listarVacunas, actualizarVacuna } from "../services/vacunasService.js";
import { listarControles, crearControl } from "../services/controlesService.js";
import { crearDatoClinico, historialClinico } from "../services/datosClinicosService.js";

const checkBebe = async (req, res) => {
  const bebeId = req.params.bebeId || req.body.bebeId;
  const bebe = await verificarBebeDeMadre(req.user.id, bebeId);
  if (!bebe) {
    res.status(404).json({ mensaje: "Bebé no encontrado." });
    return null;
  }
  return bebe;
};

export const postTriaje = async (req, res) => {
  const { bebeId, signos } = req.body;
  if (!(await checkBebe(req, res))) return;
  try {
    const r = await guardarTriaje(req.user.id, bebeId, signos || {});
    return res.status(201).json(r);
  } catch (e) {
    return res.status(500).json({ mensaje: e.message });
  }
};

export const getTriajeHistorial = async (req, res) => {
  if (!(await checkBebe(req, res))) return;
  const rows = await historialTriaje(req.params.bebeId);
  return res.json({ historial: rows });
};

export const postSeguimiento = async (req, res) => {
  const { bebeId, evaluacionRiesgoId, dia, respuestas } = req.body;
  if (!(await checkBebe(req, res))) return;
  try {
    const r = await guardarSeguimiento(req.user.id, bebeId, evaluacionRiesgoId, dia, respuestas);
    return res.status(201).json(r);
  } catch (e) {
    return res.status(e.message?.includes("Ya registraste") ? 409 : 500).json({ mensaje: e.message });
  }
};

export const getSeguimiento = async (req, res) => {
  if (!(await checkBebe(req, res))) return;
  const evalId = req.query.evaluacionRiesgoId;
  const rows = await progresoSeguimiento(req.params.bebeId, evalId);
  return res.json({ seguimientos: rows });
};

export const postBitacoraBebe = async (req, res) => {
  const { bebeId, tipoRegistro, detalles, observaciones } = req.body;
  if (!(await checkBebe(req, res))) return;
  await guardarRegistro(req.user.id, bebeId, tipoRegistro, detalles, observaciones);
  return res.status(201).json({ mensaje: "Registro guardado." });
};

export const getBitacoraBebe = async (req, res) => {
  if (!(await checkBebe(req, res))) return;
  const registros = await listarRegistros(req.params.bebeId);
  return res.json({ registros });
};

export const getVacunas = async (req, res) => {
  if (!(await checkBebe(req, res))) return;
  const vacunas = await listarVacunas(req.params.bebeId, req.user.id);
  return res.json({ vacunas });
};

export const patchVacuna = async (req, res) => {
  if (!(await checkBebe(req, res))) return;
  const { estado, fechaAplicacion } = req.body;
  await actualizarVacuna(req.params.vacunaId, req.params.bebeId, { estado, fecha_aplicacion: fechaAplicacion });
  return res.json({ mensaje: "Vacuna actualizada." });
};

export const getControles = async (req, res) => {
  if (!(await checkBebe(req, res))) return;
  const controles = await listarControles(req.params.bebeId);
  return res.json({ controles });
};

export const postControl = async (req, res) => {
  if (!(await checkBebe(req, res))) return;
  await crearControl(req.user.id, req.params.bebeId, req.body);
  return res.status(201).json({ mensaje: "Control registrado." });
};

export const postDatosClinicos = async (req, res) => {
  const { bebeId } = req.body;
  if (!(await checkBebe(req, res))) return;
  await crearDatoClinico(req.user.id, bebeId, req.body);
  return res.status(201).json({ mensaje: "Dato clínico registrado." });
};

export const getDatosClinicos = async (req, res) => {
  if (!(await checkBebe(req, res))) return;
  const historial = await historialClinico(req.params.bebeId);
  return res.json({ historial });
};
