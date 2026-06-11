import { query } from "../db.js";
import { VACUNAS_DEFAULT } from "../database/seedData.js";
import { crearNotificacion } from "./notificacionesService.js";

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const seedVacunasParaBebe = async (bebeId, fechaNacimiento) => {
  const { rows } = await query("SELECT COUNT(*) as c FROM vacunacion_neonato WHERE bebe_id = $1", [bebeId]);
  if (Number(rows[0]?.c) > 0) return;

  const base = fechaNacimiento || new Date().toISOString().slice(0, 10);
  for (const v of VACUNAS_DEFAULT) {
    await query(
      `INSERT INTO vacunacion_neonato (bebe_id, nombre_vacuna, dosis, fecha_programada, estado)
       VALUES ($1, $2, $3, $4, 'Pendiente')`,
      [bebeId, v.nombre, v.dosis, addDays(base, v.diasDesdeNacimiento)]
    );
  }
};

export const verificarAlertasVacunas = async (madreId, bebeId) => {
  const res = await query(
    `SELECT * FROM vacunacion_neonato WHERE bebe_id = $1 AND estado = 'Pendiente'`,
    [bebeId]
  );
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  for (const v of res.rows) {
    const programada = new Date(v.fecha_programada);
    programada.setHours(0, 0, 0, 0);
    const dias = Math.round((programada - hoy) / (1000 * 60 * 60 * 24));
    if (dias >= 0 && dias <= 7) {
      const existe = await query(
        `SELECT id FROM notificaciones_alertas
         WHERE madre_id = $1 AND bebe_id = $2 AND tipo_alerta = 'Vacunacion'
         AND mensaje LIKE $3 AND leido = 0`,
        [madreId, bebeId, `%${v.nombre_vacuna}%`]
      );
      if (existe.rows.length === 0) {
        await crearNotificacion({
          madreId,
          bebeId,
          tipoAlerta: "Vacunacion",
          mensaje: `Vacuna ${v.nombre_vacuna} (${v.dosis}) programada para ${v.fecha_programada}.`,
        });
      }
    }
  }
};

export const listarVacunas = async (bebeId, madreId = null) => {
  if (madreId) await verificarAlertasVacunas(madreId, bebeId);
  const res = await query(
    "SELECT * FROM vacunacion_neonato WHERE bebe_id = $1 ORDER BY fecha_programada",
    [bebeId]
  );
  return res.rows;
};

export const actualizarVacuna = async (vacunaId, bebeId, datos) => {
  const { estado, fecha_aplicacion } = datos;
  await query(
    `UPDATE vacunacion_neonato SET estado = $1, fecha_aplicacion = $2 WHERE id = $3 AND bebe_id = $4`,
    [estado, fecha_aplicacion || null, vacunaId, bebeId]
  );
};
