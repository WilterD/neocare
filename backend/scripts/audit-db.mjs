import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "../database/neocare.db"));

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  .all()
  .map((r) => r.name);

console.log("TABLAS:", tables.join(", "));
for (const t of tables) {
  const c = db.prepare(`SELECT COUNT(*) as n FROM ${t}`).get().n;
  console.log(`  ${t}: ${c}`);
}

db.close();
