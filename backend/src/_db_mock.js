// Mock de db.js
const BEBES = [];
const EVALUACIONES = {};
const SEGUIMIENTO = {};
const VACUNAS = {};
const CONTROLES = {};

function query(text, params = []) {
  const s = text.toLowerCase();
  if (s.includes("from recien_nacidos rn") && s.includes("left join")) return Promise.resolve({ rows: BEBES });
  if (s.includes("from recien_nacidos") && s.includes("where rn.id")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: BEBES.filter(b => b.id === id) });
  }
  if (s.includes("from recien_nacidos where id")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: BEBES.filter(b => b.id === id) });
  }
  if (s.includes("evaluaciones_riesgo_bebe") && s.includes("limit")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: (EVALUACIONES[id] || []).slice(0, 1) });
  }
  if (s.includes("evaluaciones_riesgo_bebe")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: EVALUACIONES[id] || [] });
  }
  if (s.includes("seguimiento_diario_neonato")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: SEGUIMIENTO[id] || [] });
  }
  if (s.includes("vacunacion_neonato")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: VACUNAS[id] || [] });
  }
  if (s.includes("controles_nino_sano")) {
    const id = Number(params[0]);
    return Promise.resolve({ rows: CONTROLES[id] || [] });
  }
  return Promise.resolve({ rows: [] });
}

export { query };
export const transaction = async (cb) => cb(query);
