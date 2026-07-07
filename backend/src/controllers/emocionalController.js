import { query } from "../db.js";

export const listarBitacoraEmocional = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM bitacora_emocional WHERE madre_id = $1 ORDER BY fecha_registro DESC`,
      [req.user.id]
    );
    return res.json({ total: rows.length, entradas: rows });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener bitácora emocional.",
      error: error.message,
    });
  }
};

export const crearBitacoraEmocional = async (req, res) => {
  try {
    const { nivelAnimo, nivelAnsiedad, nivelCansancio, notaDiaria, sintomasFisicos } =
      req.body;

    if (!nivelAnimo || !nivelAnsiedad || !nivelCansancio) {
      return res.status(400).json({
        mensaje: "Nivel de ánimo, ansiedad y cansancio son obligatorios (1-5).",
      });
    }

    const puntaje =
      Number(nivelAnimo) + Number(nivelAnsiedad) + Number(nivelCansancio);

    const sql = `
      INSERT INTO bitacora_emocional (
        madre_id, nivel_animo, nivel_ansiedad, nivel_cansancio, puntaje_simple, nota_diaria, sintomas_fisicos
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const { rows } = await query(sql, [
      req.user.id,
      Number(nivelAnimo),
      Number(nivelAnsiedad),
      Number(nivelCansancio),
      puntaje,
      notaDiaria || null,
      sintomasFisicos ? JSON.stringify(sintomasFisicos) : null,
    ]);

    return res.status(201).json({
      mensaje: "Entrada de diario emocional guardada.",
      id: rows[0]?.id,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al guardar bitácora emocional.",
      error: error.message,
    });
  }
};

export const listarEpds = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM evaluaciones_epds WHERE madre_id = $1 ORDER BY fecha_evaluacion DESC`,
      [req.user.id]
    );
    return res.json({ total: rows.length, evaluaciones: rows });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener evaluaciones EPDS.",
      error: error.message,
    });
  }
};

const clasificarEpds = (total) => {
  if (total <= 9) return "Bajo";
  if (total <= 12) return "Moderado";
  return "Alto";
};

export const crearEpds = async (req, res) => {
  try {
    const respuestas = req.body.respuestas || req.body;
    const campos = [
      "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10",
    ];

    let total = 0;
    const valores = [];
    for (const c of campos) {
      const v = Number(respuestas[c] ?? respuestas[`${c}_capaz_reir`] ?? 0);
      if (v < 0 || v > 3) {
        return res.status(400).json({ mensaje: `Respuesta inválida en ${c}.` });
      }
      total += v;
      valores.push(v);
    }

    const clasificacion = clasificarEpds(total);

    const sql = `
      INSERT INTO evaluaciones_epds (
        madre_id, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, puntuacion_total, clasificacion
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id
    `;

    const { rows } = await query(sql, [
      req.user.id,
      ...valores,
      total,
      clasificacion,
    ]);

    return res.status(201).json({
      mensaje: "Evaluación EPDS guardada.",
      id: rows[0]?.id,
      puntuacionTotal: total,
      clasificacion,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al guardar EPDS.",
      error: error.message,
    });
  }
};
