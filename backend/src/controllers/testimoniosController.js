import { query } from "../db.js";

export const listarTestimonios = async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, nombre, contenido, etapa, creado_en FROM testimonios ORDER BY creado_en DESC"
    );
    return res.json({ total: rows.length, testimonios: rows });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener testimonios.",
      error: error.message,
    });
  }
};
