import { query } from "../db.js";
import { CONTENIDO_EDUCATIVO, TESTIMONIOS } from "./seedData.js";

export const seedDatabase = async () => {
  try {
    const { rows } = await query("SELECT COUNT(*) as total FROM biblioteca_educativa");
    const total = Number(rows[0]?.total ?? 0);
    if (total < 28) {
      await query("DELETE FROM biblioteca_educativa");
      for (const item of CONTENIDO_EDUCATIVO) {
        await query(
          `INSERT INTO biblioteca_educativa (titulo, tema, descripcion, recomendacion, nivel_alerta, url_recurso, fuente_referencia)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [item.titulo, item.tema, item.descripcion, item.recomendacion, item.nivel_alerta, item.url_recurso, item.fuente_referencia]
        );
      }
      console.log(`Seed: ${CONTENIDO_EDUCATIVO.length} artículos educativos.`);
    }

    const { rows: tRows } = await query("SELECT COUNT(*) as total FROM testimonios");
    const tTotal = Number(tRows[0]?.total ?? 0);
    if (tTotal === 0) {
      for (const t of TESTIMONIOS) {
        await query(
          `INSERT INTO testimonios (nombre, contenido, etapa) VALUES ($1, $2, $3)`,
          [t.nombre, t.contenido, t.etapa]
        );
      }
      console.log(`Seed: ${TESTIMONIOS.length} testimonios.`);
    }
  } catch (err) {
    console.warn("Seed omitido o falló:", err.message);
  }
};
