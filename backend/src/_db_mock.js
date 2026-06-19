// Mock de db.js
const BEBES = [
  { id: 1, madre_id: 1, nombre_bebe: "Mateo Pérez", fecha_nacimiento: new Date(Date.now() - 7*86400000), peso_al_nacer: 3.2, edad_gestacional: 39, sexo: "Masculino", tipo_parto: "Vaginal", complicaciones_al_nacer: false, especificacion_complicaciones: null, hospitalizacion_neonatal: false, motivo_hospitalizacion: null, duracion_hospitalizacion: null, requirio_cuidados_especiales: "No", tipo_cuidado_recibido: null, creado_en: new Date(), nombre_madre: "María Pérez", telefono_madre: "04141234567", correo_madre: "maria@test.com", edad_madre: 28 },
  { id: 2, madre_id: 2, nombre_bebe: "Sofía Gómez", fecha_nacimiento: new Date(Date.now() - 45*86400000), peso_al_nacer: 2.8, edad_gestacional: 37, sexo: "Femenino", tipo_parto: "Cesárea", complicaciones_al_nacer: true, especificacion_complicaciones: "Ictericia", hospitalizacion_neonatal: true, motivo_hospitalizacion: "Fototerapia", duracion_hospitalizacion: "3 días", requirio_cuidados_especiales: "Sí", tipo_cuidado_recibido: "Cuidado intermedio", creado_en: new Date(), nombre_madre: "Ana Gómez", telefono_madre: "04147654321", correo_madre: "ana@test.com", edad_madre: 35 },
  { id: 3, madre_id: 3, nombre_bebe: "Lucas Rodríguez", fecha_nacimiento: new Date(Date.now() - 200*86400000), peso_al_nacer: 3.5, edad_gestacional: 40, sexo: "Masculino", tipo_parto: "Vaginal", complicaciones_al_nacer: false, especificacion_complicaciones: null, hospitalizacion_neonatal: false, motivo_hospitalizacion: null, duracion_hospitalizacion: null, requirio_cuidados_especiales: "No", tipo_cuidado_recibido: null, creado_en: new Date(), nombre_madre: "Lucía Rodríguez", telefono_madre: "04149876543", correo_madre: "lucia@test.com", edad_madre: 24 }
];
const EVALUACIONES = {
  1: [{ id: 1, bebe_id: 1, fecha_evaluacion: new Date(), nivel_riesgo: "Bajo", puntuacion_total: 1, convulsiones: false, dificultad_respiratoria: false, coloracion_azulada: false, fiebre_hipotermia: false, rechazo_alimentacion: false, disminucion_conciencia: false, vomitos_repetitivos: false, ictericia_progresiva: false, disminucion_actividad: false, llanto_persistente: false, alteraciones_sueno: true, disminucion_apetito: false, irritabilidad_ocasional: false }],
  2: [{ id: 2, bebe_id: 2, fecha_evaluacion: new Date(), nivel_riesgo: "Moderado", puntuacion_total: 4, convulsiones: false, dificultad_respiratoria: false, coloracion_azulada: false, fiebre_hipotermia: false, rechazo_alimentacion: false, disminucion_conciencia: false, vomitos_repetitivos: true, ictericia_progresiva: true, disminucion_actividad: false, llanto_persistente: false, alteraciones_sueno: false, disminucion_apetito: false, irritabilidad_ocasional: false }],
  3: [{ id: 3, bebe_id: 3, fecha_evaluacion: new Date(), nivel_riesgo: "Alto", puntuacion_total: 6, convulsiones: false, dificultad_respiratoria: false, coloracion_azulada: false, fiebre_hipotermia: true, rechazo_alimentacion: true, disminucion_conciencia: false, vomitos_repetitivos: false, ictericia_progresiva: false, disminucion_actividad: false, llanto_persistente: false, alteraciones_sueno: false, disminucion_apetito: false, irritabilidad_ocasional: false }]
};
const SEGUIMIENTO = {
  2: [
    { id: 1, bebe_id: 2, evaluacion_riesgo_id: 2, dia_seguimiento: 1, fecha_registro: new Date(Date.now() - 5*86400000), alimentacion_normal: "Mejoró", alimentacion_rechazo: "No", temperatura_fiebre: "No", temperatura_frio: "No", actividad_normal: "Mejoró", actividad_letargo: "No", respiracion_normal: "Igual", respiracion_dificultad: "No", piel_normal: "Igual", piel_alteracion: "No", eliminacion_panales: "Mejoró", eliminacion_deposiciones: "Igual", llanto_normal: "Igual", llanto_alteracion: "No", alarma_convulsiones: "No", alarma_vomito: "No", alarma_empeoramiento: "No", resultado_evolucion: "Amarillo" },
    { id: 2, bebe_id: 2, evaluacion_riesgo_id: 2, dia_seguimiento: 2, fecha_registro: new Date(Date.now() - 4*86400000), alimentacion_normal: "Mejoró", alimentacion_rechazo: "No", temperatura_fiebre: "No", temperatura_frio: "No", actividad_normal: "Mejoró", actividad_letargo: "No", respiracion_normal: "Mejoró", respiracion_dificultad: "No", piel_normal: "Mejoró", piel_alteracion: "No", eliminacion_panales: "Mejoró", eliminacion_deposiciones: "Mejoró", llanto_normal: "Mejoró", llanto_alteracion: "No", alarma_convulsiones: "No", alarma_vomito: "No", alarma_empeoramiento: "No", resultado_evolucion: "Verde" }
  ]
};
const VACUNAS = { 1: [], 2: [], 3: [{ id: 1, bebe_id: 3, nombre_vacuna: "BCG", dosis: "Única", fecha_programada: new Date(Date.now() - 200*86400000), fecha_aplicacion: new Date(Date.now() - 200*86400000), estado: "Aplicada" }] };
const CONTROLES = { 1: [], 2: [], 3: [{ id: 1, bebe_id: 3, fecha_control: new Date(Date.now() - 30*86400000), peso_kg: 4.8, talla_cm: 56, perimetro_cefalico_cm: 38, observaciones: "Crecimiento adecuado", estado: "Realizado" }] };

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
