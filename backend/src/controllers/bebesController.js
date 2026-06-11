import { listarBebes, obtenerBebe, crearBebe, actualizarBebe } from "../services/bebesService.js";

export const getBebes = async (req, res) => {
  const bebes = await listarBebes(req.user.id);
  return res.json({ bebes });
};

export const getBebeById = async (req, res) => {
  const bebe = await obtenerBebe(req.user.id, req.params.id);
  if (!bebe) return res.status(404).json({ mensaje: "Bebé no encontrado." });
  return res.json(bebe);
};

export const postBebe = async (req, res) => {
  try {
    const id = await crearBebe(req.user.id, req.body);
    return res.status(201).json({ mensaje: "Bebé registrado.", bebeId: id });
  } catch (e) {
    return res.status(500).json({ mensaje: e.message });
  }
};

export const putBebe = async (req, res) => {
  const bebe = await obtenerBebe(req.user.id, req.params.id);
  if (!bebe) return res.status(404).json({ mensaje: "Bebé no encontrado." });
  await actualizarBebe(req.user.id, req.params.id, req.body);
  return res.json({ mensaje: "Bebé actualizado." });
};
