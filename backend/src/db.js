import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbType = process.env.DB_TYPE || "sqlite";

let poolPostgres = null;
let poolMysql = null;
let sqliteDb = null;

const toQuestionMarks = (sql) => sql.replace(/\$\d+/g, "?");

const initSqlite = () => {
  const dbPath =
    process.env.SQLITE_PATH ||
    path.join(__dirname, "..", "database", "neocare.db");
  const schemaPath = path.join(__dirname, "..", "database", "schema_sqlite.sql");

  sqliteDb = new Database(dbPath);
  sqliteDb.pragma("foreign_keys = ON");

  if (fs.existsSync(schemaPath)) {
    sqliteDb.exec(fs.readFileSync(schemaPath, "utf-8"));
  }

  const migrations = [
    "ALTER TABLE madres_cuidadores ADD COLUMN oauth_only INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE madres_cuidadores ADD COLUMN ultimo_checkin_emocional TEXT",
    "ALTER TABLE biblioteca_educativa ADD COLUMN url_recurso TEXT",
    "ALTER TABLE biblioteca_educativa ADD COLUMN fuente_referencia TEXT",
  ];
  for (const sql of migrations) {
    try { sqliteDb.exec(sql); } catch { /* ya existe */ }
  }

  console.log(`Servicio de Base de Datos: SQLite (${dbPath})`);
};

if (dbType === "sqlite") {
  initSqlite();
} else if (dbType === "postgres") {
  poolPostgres = new pg.Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://neocare:neocare_pass@localhost:5432/neocare",
  });
  console.log("Servicio de Base de Datos: PostgreSQL");
} else if (dbType === "mysql") {
  poolMysql = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "neocare",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("Servicio de Base de Datos: MySQL");
} else {
  console.warn("DB_TYPE no reconocido. Usando SQLite.");
  initSqlite();
}

const normalizeSqliteParams = (params) =>
  params.map((p) => (typeof p === "boolean" ? (p ? 1 : 0) : p));

const runSqlite = (text, params = []) => {
  const sql = toQuestionMarks(text);
  const bound = normalizeSqliteParams(params);
  const stmt = sqliteDb.prepare(sql);

  if (/^\s*INSERT/i.test(text) && /RETURNING/i.test(text)) {
    const row = stmt.get(...bound);
    return { rows: row ? [row] : [] };
  }

  if (/^\s*SELECT/i.test(text)) {
    return { rows: stmt.all(...bound) };
  }

  const info = stmt.run(...bound);
  if (info.changes > 0 && /^\s*INSERT/i.test(text)) {
    return { rows: [{ id: Number(info.lastInsertRowid), insertId: info.lastInsertRowid }] };
  }

  return { rows: [] };
};

export const query = async (text, params = []) => {
  if (sqliteDb) {
    return runSqlite(text, params);
  }

  if (dbType === "postgres") {
    const res = await poolPostgres.query(text, params);
    return { rows: res.rows };
  }

  let mysqlText = toQuestionMarks(text);
  const [rows] = await poolMysql.execute(mysqlText, params);
  return { rows: Array.isArray(rows) ? rows : [rows] };
};

export const transaction = async (callback) => {
  if (sqliteDb) {
    const executeQuery = (text, params = []) =>
      Promise.resolve(runSqlite(text, params));
    sqliteDb.exec("BEGIN");
    try {
      const result = await callback(executeQuery);
      sqliteDb.exec("COMMIT");
      return result;
    } catch (err) {
      sqliteDb.exec("ROLLBACK");
      throw err;
    }
  }

  if (dbType === "postgres") {
    const client = await poolPostgres.connect();
    try {
      await client.query("BEGIN");
      const executeQuery = (text, params = []) =>
        client.query(text, params).then((res) => ({ rows: res.rows }));
      const result = await callback(executeQuery);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  const connection = await poolMysql.getConnection();
  try {
    await connection.beginTransaction();
    const executeQuery = async (text, params = []) => {
      const mysqlText = toQuestionMarks(text);
      const [rows] = await connection.execute(mysqlText, params);
      return { rows: Array.isArray(rows) ? rows : [rows] };
    };
    const result = await callback(executeQuery);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
