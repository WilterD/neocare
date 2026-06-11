import { query } from "../db.js";

export const listarContenido = async (req, res) => {
  try {
    const { tema, nivelAlerta } = req.query;
    let sql = "SELECT * FROM biblioteca_educativa WHERE 1=1";
    const params = [];

    if (tema) {
      params.push(tema);
      sql += ` AND tema = $${params.length}`;
    }
    if (nivelAlerta) {
      params.push(nivelAlerta);
      sql += ` AND nivel_alerta = $${params.length}`;
    }

    sql += " ORDER BY nivel_alerta DESC, titulo ASC";
    const { rows } = await query(sql, params);

    return res.json({
      total: rows.length,
      contenido: rows.map((r) => ({
        id: r.id,
        titulo: r.titulo,
        tema: r.tema,
        descripcion: r.descripcion,
        recomendacion: r.recomendacion,
        nivelAlerta: r.nivel_alerta,
        urlRecurso: r.url_recurso,
        fuenteReferencia: r.fuente_referencia,
        creadoEn: r.creado_en,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener contenido educativo.",
      error: error.message,
    });
  }
};

export const obtenerContenidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query("SELECT * FROM biblioteca_educativa WHERE id = $1", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Contenido no encontrado." });
    }

    const r = rows[0];
    return res.json({
      id: r.id,
      titulo: r.titulo,
      tema: r.tema,
      descripcion: r.descripcion,
      recomendacion: r.recomendacion,
      nivelAlerta: r.nivel_alerta,
      urlRecurso: r.url_recurso,
      fuenteReferencia: r.fuente_referencia,
      creadoEn: r.creado_en,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener el contenido.",
      error: error.message,
    });
  }
};
