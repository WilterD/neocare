import { query } from "../db.js";

export const crearDatoClinico = async (madreId, bebeId, datos) => {
  await query(
    `INSERT INTO datos_clinicos_historial (bebe_id, madre_id, tipo_parto, complicaciones_nacer, especificacion_complicaciones, hospitalizacion_neonatal, motivo_hospitalizacion)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      bebeId, madreId, datos.tipoParto,
      datos.complicacionesNacer === "Sí" ? 1 : 0,
      datos.complicacion || null,
      datos.hospitalizacionNeonatal === "Sí" ? 1 : 0,
      datos.motivoHospitalizacion || null,
    ]
  );
};

export const historialClinico = async (bebeId) => {
  const res = await query(
    `SELECT * FROM datos_clinicos_historial WHERE bebe_id = $1 ORDER BY creado_en DESC`,
    [bebeId]
  );
  return res.rows;
};
