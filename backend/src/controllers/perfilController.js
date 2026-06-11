import { obtenerPerfilCompleto, actualizarPerfil } from "../services/perfilService.js";

export const getPerfilMe = async (req, res) => {
  try {
    const data = await obtenerPerfilCompleto(req.user.id);
    if (!data) return res.status(404).json({ mensaje: "Perfil no encontrado." });
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ mensaje: e.message });
  }
};

export const putPerfilMe = async (req, res) => {
  try {
    await actualizarPerfil(req.user.id, req.body);
    const data = await obtenerPerfilCompleto(req.user.id);
    return res.json({ mensaje: "Perfil actualizado.", ...data });
  } catch (e) {
    return res.status(500).json({ mensaje: e.message });
  }
};
