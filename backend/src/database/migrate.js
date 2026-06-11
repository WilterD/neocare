import { query } from "../db.js";

const COLUMNS = [
  { table: "madres_cuidadores", col: "oauth_only", def: "INTEGER NOT NULL DEFAULT 0" },
  { table: "madres_cuidadores", col: "ultimo_checkin_emocional", def: "TEXT" },
  { table: "biblioteca_educativa", col: "url_recurso", def: "TEXT" },
  { table: "biblioteca_educativa", col: "fuente_referencia", def: "TEXT" },
];

export const runMigrations = async () => {
  for (const { table, col, def } of COLUMNS) {
    try {
      await query(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
    } catch {
      // columna ya existe
    }
  }
};
