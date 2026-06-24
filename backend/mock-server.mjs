// Mock de BD con datos en memoria
const BEBES = [];
const EVALUACIONES = {};
const SEGUIMIENTO = {};
const VACUNAS = {};
const CONTROLES = {};

import express from "express";
import cors from "cors";
import {
  listarBebes,
  obtenerBebeDetalle,
  obtenerModuloEducativoCompleto,
  obtenerTriajeBebe,
  obtenerSeguimientoBebe,
  obtenerVacunasControlesBebe,
  guardarTriajeBebe,
  guardarSeguimientoBebe,
  guardarControlBebe,
  actualizarEstadoVacuna
} from "./src/controllers/bebesController.js";

const app = express();
app.use(cors({ origin: true, methods: ["GET","POST","PUT","DELETE"], credentials: true }));
app.use(express.json());
app.get("/", (req, res) => res.json({ mensaje: "NeoCare MOCK" }));
app.get("/api/bebes", listarBebes);
app.get("/api/bebes/:id", obtenerBebeDetalle);
app.get("/api/bebes/:id/triaje", obtenerTriajeBebe);
app.get("/api/bebes/:id/seguimiento", obtenerSeguimientoBebe);
app.get("/api/bebes/:id/vacunas-controles", obtenerVacunasControlesBebe);
app.get("/api/bebes/:id/modulo-educativo", obtenerModuloEducativoCompleto);

// Rutas POST/PUT para Mock Server
app.post("/api/bebes/:id/triaje", guardarTriajeBebe);
app.post("/api/bebes/:id/seguimiento", guardarSeguimientoBebe);
app.post("/api/bebes/:id/controles", guardarControlBebe);
app.post("/api/bebes/:id/vacunas", actualizarEstadoVacuna);

// Override query: monkey-patch el módulo controllers importando db primero
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
const dbPath = path.resolve("./src/db.js");
const origDb = readFileSync(dbPath, "utf8");
if (!origDb.includes("MOCK_OVERRIDE")) {
  const mockExport = `
const BEBES_MOCK = ${JSON.stringify(BEBES, null, 2)};
const EVAL_MOCK = ${JSON.stringify(EVALUACIONES, null, 2)};
const SEG_MOCK = ${JSON.stringify(SEGUIMIENTO, null, 2)};
const VAC_MOCK = ${JSON.stringify(VACUNAS, null, 2)};
const CTRL_MOCK = ${JSON.stringify(CONTROLES, null, 2)};
// MOCK_OVERRIDE marker
function _q(text, params = []) {
  const s = text.toLowerCase();
  if (s.includes("from recien_nacidos rn") && s.includes("left join")) return Promise.resolve({ rows: BEBES_MOCK });
  if (s.includes("from recien_nacidos") && s.includes("where rn.id")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: BEBES_MOCK.filter(b => b.id === id) });
  }
  if (s.includes("from recien_nacidos where id")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: BEBES_MOCK.filter(b => b.id === id) });
  }
  if (s.includes("evaluaciones_riesgo_bebe") && s.includes("limit")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: (EVAL_MOCK[id] || []).slice(0, 1) });
  }
  if (s.includes("evaluaciones_riesgo_bebe")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: EVAL_MOCK[id] || [] });
  }
  if (s.includes("seguimiento_diario_neonato")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: SEG_MOCK[id] || [] });
  }
  if (s.includes("vacunacion_neonato")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: VAC_MOCK[id] || [] });
  }
  if (s.includes("controles_nino_sano")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: CTRL_MOCK[id] || [] });
  }
  if (s.includes("insert into") || s.includes("update ")) {
    return Promise.resolve({ rows: [{ id: Math.floor(Math.random() * 1000) + 1, insertId: 999 }] });
  }
  return Promise.resolve({ rows: [] });
}
export const query = _q;
export const transaction = async (cb) => cb(_q);
`;
  // Reemplazar TODO el contenido del db.js por un mock mínimo
  writeFileSync(dbPath, mockExport);
  console.log("[Mock] db.js reemplazado temporalmente");
}

app.listen(4000, () => console.log("MOCK listening on 4000"));
