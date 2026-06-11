import { query } from "../db.js";

export const listarControles = async (bebeId) => {
  const res = await query(
    `SELECT * FROM controles_nino_sano WHERE bebe_id = $1 ORDER BY fecha_control DESC`,
    [bebeId]
  );
  return res.rows;
};

export const crearControl = async (madreId, bebeId, datos) => {
  await query(
    `INSERT INTO controles_nino_sano (bebe_id, madre_id, fecha_control, peso_kg, talla_cm, perimetro_cefalico_cm, observaciones, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'Realizado')`,
    [bebeId, madreId, datos.fechaControl, datos.pesoKg, datos.tallaCm, datos.perimetroCefalicoCm, datos.observaciones || null]
  );
};
