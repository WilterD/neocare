// Sobrescribir el db.js real con un proxy al mock
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const dbPath = path.resolve("./src/db.js");
const orig = readFileSync(dbPath, "utf8");

if (!orig.includes("// MOCK_INSTALLED")) {
  const content = `// MOCK_INSTALLED
import { query, transaction } from "./_db_mock.js";
export { query, transaction };
`;
  writeFileSync(dbPath, content);
  console.log("[mock-server] db.js -> _db_mock.js");
}

const express = (await import("express")).default;
const cors = (await import("cors")).default;
const controllers = await import("./src/controllers/bebesController.js");

const app = express();
app.use(cors({ origin: true, methods: ["GET","POST","PUT","DELETE"], credentials: true }));
app.use(express.json());
app.get("/", (req, res) => res.json({ mensaje: "NeoCare MOCK" }));
app.get("/api/bebes", controllers.listarBebes);
app.get("/api/bebes/:id", controllers.obtenerBebeDetalle);
app.get("/api/bebes/:id/triaje", controllers.obtenerTriajeBebe);
app.get("/api/bebes/:id/seguimiento", controllers.obtenerSeguimientoBebe);
app.get("/api/bebes/:id/vacunas-controles", controllers.obtenerVacunasControlesBebe);
app.get("/api/bebes/:id/modulo-educativo", controllers.obtenerModuloEducativoCompleto);
app.listen(4000, () => console.log("[mock-server] MOCK listening on 4000"));
