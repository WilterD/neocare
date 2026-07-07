import pg from "pg";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbType = process.env.DB_TYPE || "sqlite";

const resolveSqlitePath = () => {
  const backendRoot = path.join(__dirname, "..");
  const configuredPath = process.env.SQLITE_PATH;
  return configuredPath
    ? path.isAbsolute(configuredPath)
      ? configuredPath
      : path.resolve(backendRoot, configuredPath.replace(/^\.\//, ""))
    : path.join(backendRoot, "database", "neocare.db");
};

let poolPostgres = null;
let poolMysql = null;
let sqliteDb = null;

if (dbType === "sqlite") {
  const dbPath = resolveSqlitePath();
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma("foreign_keys = ON");
  console.log(`Servicio de Base de Datos: SQLite (${dbPath})`);
} else if (dbType === "postgres") {
  poolPostgres = new pg.Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/neocare",
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
  console.warn("DB_TYPE no válido. Usando SQLite por defecto.");
}

export const getDbInfo = () => {
  if (dbType === "sqlite" && sqliteDb) {
    return { type: "sqlite", path: resolveSqlitePath() };
  }
  return { type: dbType };
};

const toSqliteParams = (text, params) => {
  let i = 0;
  const sqliteText = text.replace(/\$\d+/g, () => "?");
  return { text: sqliteText, params };
};

const stripReturning = (text) =>
  text.replace(/\s+RETURNING\s+[\w\s,*]+;?\s*$/i, ";");

const prepareMysqlQuery = (text) => {
  let mysqlText = text.replace(/\$\d+/g, "?");
  mysqlText = mysqlText.replace(/\s+RETURNING\s+\w+\s*;?/gi, "");
  return mysqlText;
};

const sanitizeParams = (params = []) =>
  params.map((p) => {
    if (typeof p === "boolean") return p ? 1 : 0;
    if (p instanceof Date) return p.toISOString().slice(0, 10);
    return p;
  });

const runSqliteQuery = (text, params = []) => {
  const safeParams = sanitizeParams(params);
  const isInsert = /^\s*INSERT/i.test(text);
  const hasReturning = /RETURNING/i.test(text);

  if (isInsert && hasReturning) {
    const insertSql = text.replace(/\s+RETURNING\s+[\w\s,*]+;?\s*$/i, "");
    const info = sqliteDb.prepare(insertSql).run(...safeParams);
    const id = info.lastInsertRowid;
    return { rows: [{ id }] };
  }

  if (/^\s*SELECT/i.test(text)) {
    const rows = sqliteDb.prepare(text.replace(/\$\d+/g, "?")).all(...safeParams);
    return { rows };
  }

  if (/^\s*(UPDATE|DELETE)/i.test(text)) {
    const info = sqliteDb.prepare(text.replace(/\$\d+/g, "?")).run(...safeParams);
    return { rows: [{ changes: info.changes }] };
  }

  const sqliteText = text.replace(/\$\d+/g, "?");
  const info = sqliteDb.prepare(sqliteText).run(...safeParams);
  if (info.lastInsertRowid) {
    return { rows: [{ id: info.lastInsertRowid }] };
  }
  return { rows: [] };
};

export const query = async (text, params = []) => {
  if (dbType === "sqlite") {
    const sqliteText = text.replace(/\$\d+/g, "?");
    return runSqliteQuery(sqliteText, params);
  }

  if (dbType === "postgres") {
    const res = await poolPostgres.query(text, params);
    return { rows: res.rows };
  }

  const mysqlText = prepareMysqlQuery(text);
  const [rows] = await poolMysql.execute(mysqlText, params);
  return { rows: Array.isArray(rows) ? rows : [rows] };
};

export const transaction = async (callback) => {
  if (dbType === "sqlite") {
    sqliteDb.exec("BEGIN");
    try {
      const executeQuery = async (text, params = []) => {
        const sqliteText = text.replace(/\$\d+/g, "?");
        return runSqliteQuery(sqliteText, params);
      };
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
      const mysqlText = prepareMysqlQuery(text);
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
