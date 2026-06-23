import pg from "pg";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbType = process.env.DB_TYPE || "postgres"; // "postgres" o "mysql"

let poolPostgres = null;
let poolMysql = null;

if (dbType === "postgres") {
  poolPostgres = new pg.Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/neocare",
  });
  console.log("Servicio de Base de Datos: Configurado para usar PostgreSQL");
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
  console.log("Servicio de Base de Datos: Configurado para usar MySQL");
} else {
  console.warn("Advertencia: No se definió un DB_TYPE válido. Usando PostgreSQL por defecto.");
}

/**
 * Helper para normalizar consultas de PostgreSQL para MySQL.
 */
const prepareMysqlQuery = (text) => {
  let mysqlText = text;
  if (/\$\d+/.test(mysqlText)) {
    mysqlText = mysqlText.replace(/\$\d+/g, "?");
  }
  // Elimina la cláusula RETURNING de PostgreSQL para compatibilidad con MySQL
  mysqlText = mysqlText.replace(/\s+RETURNING\s+\w+\s*;?/gi, "");
  return mysqlText;
};

/**
 * Ejecuta una consulta SQL con parámetros de forma agnóstica al motor.
 * @param {string} text - Consulta SQL (usa placeholders estándar como $1, $2 en Postgres y ? en MySQL).
 * @param {Array} params - Parámetros de la consulta.
 * @returns {Promise<Object>} - Resultado con la propiedad { rows }.
 */
export const query = async (text, params = []) => {
  if (dbType === "postgres") {
    // PostgreSQL usa $1, $2, etc.
    const res = await poolPostgres.query(text, params);
    return { rows: res.rows };
  } else {
    // MySQL usa '?' como placeholder y no soporta RETURNING
    const mysqlText = prepareMysqlQuery(text);
    const [rows] = await poolMysql.execute(mysqlText, params);
    
    // Devolvemos el mismo formato { rows } para que el controlador sea agnóstico
    return { rows: Array.isArray(rows) ? rows : [rows] };
  }
};

/**
 * Ejecuta consultas dentro de una transacción.
 * Recibe un callback que contiene las operaciones a realizar pasándole una función query específica.
 */
export const transaction = async (callback) => {
  if (dbType === "postgres") {
    const client = await poolPostgres.connect();
    try {
      await client.query("BEGIN");
      const executeQuery = (text, params = []) => client.query(text, params).then(res => ({ rows: res.rows }));
      const result = await callback(executeQuery);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } else {
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
  }
};

