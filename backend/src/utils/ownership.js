import { query } from "../db.js";

export const verificarBebeDeMadre = async (madreId, bebeId) => {
  const res = await query(
    "SELECT id, nombre_bebe FROM recien_nacidos WHERE id = $1 AND madre_id = $2",
    [bebeId, madreId]
  );
  return res.rows[0] || null;
};
