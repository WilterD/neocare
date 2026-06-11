import { listarNotificaciones, contarNoLeidas, marcarLeida } from "../services/notificacionesService.js";

export const getNotificaciones = async (req, res) => {
  const notificaciones = await listarNotificaciones(req.user.id);
  const noLeidas = await contarNoLeidas(req.user.id);
  return res.json({ notificaciones, noLeidas });
};

export const patchNotificacionLeida = async (req, res) => {
  await marcarLeida(req.user.id, req.params.id);
  return res.json({ mensaje: "Marcada como leída." });
};
