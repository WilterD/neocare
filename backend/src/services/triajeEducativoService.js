/**
 * Servicio educativo del Sistema de Triaje Neonatal.
 *
 * Clasifica el riesgo del recién nacido a partir de los signos
 * de alarma reportados. Replica las reglas de la BD:
 *   - Signos de alto riesgo:   3 puntos
 *   - Signos de riesgo medio:  2 puntos
 *   - Signos de bajo riesgo:   1 punto
 *   - 0-2 puntos  -> Bajo
 *   - 3-5 puntos  -> Medio
 *   - >=6 puntos  -> Alto
 *   - Cualquier signo de alto riesgo => resultado Alto
 */
const SIGNS_CATALOG = {
  convulsiones: { label: "Convulsiones", points: 3, category: "alto" },
  dificultadRespiratoria: {
    label: "Dificultad respiratoria",
    points: 3,
    category: "alto",
  },
  coloracionAzulada: {
    label: "Coloración azulada de labios o piel",
    points: 3,
    category: "alto",
  },
  fiebreHipotermia: {
    label: "Fiebre o hipotermia",
    points: 3,
    category: "alto",
  },
  rechazoAlimentacion: {
    label: "Rechazo completo de la alimentación",
    points: 3,
    category: "alto",
  },
  disminucionConciencia: {
    label: "Disminución importante del estado de conciencia",
    points: 3,
    category: "alto",
  },
  vomitosRepetitivos: {
    label: "Vómitos repetitivos",
    points: 2,
    category: "medio",
  },
  ictericiaProgresiva: {
    label: "Ictericia progresiva",
    points: 2,
    category: "medio",
  },
  disminucionActividad: {
    label: "Disminución de la actividad habitual",
    points: 2,
    category: "medio",
  },
  llantoPersistente: {
    label: "Llanto persistente o inconsolable",
    points: 2,
    category: "medio",
  },
  alteracionesSueno: {
    label: "Alteraciones leves del sueño",
    points: 1,
    category: "bajo",
  },
  disminucionApetito: {
    label: "Disminución leve del apetito",
    points: 1,
    category: "bajo",
  },
  irritabilidadOcasional: {
    label: "Irritabilidad ocasional",
    points: 1,
    category: "bajo",
  },
};

const isYes = (v) => {
  const s = String(v ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return (
    s === "si" ||
    s === "sí" ||
    s === "true" ||
    s === "1" ||
    s === "yes" ||
    s === "presente" ||
    s === "registrado" ||
    s === "seleccionado"
  );
};

const RISK_COLORS = {
  Bajo: "#6fa04f",
  Moderado: "#e0a64a",
  Alto: "#c64a4a",
};

const RECOMMENDATIONS = {
  Bajo: {
    title: "Cuidados generales en casa",
    text:
      "Mantén los cuidados generales del recién nacido, observa su alimentación, " +
      "temperatura, respiración y coloración de la piel. Si aparece algún cambio, " +
      "vuelve a evaluarlo.",
    followUp: "Consulta el contenido educativo y repite la evaluación si hay cambios.",
  },
  Moderado: {
    title: "Seguimiento reforzado",
    text:
      "Activa el seguimiento diario de los siguientes 5 días y consulta a un " +
      "profesional de salud en menos de 24 horas si las señales persisten.",
    followUp: "Registra la evolución diaria y mantente atenta a signos de empeoramiento.",
  },
  Alto: {
    title: "Atención médica inmediata",
    text:
      "Acude de inmediato al centro de salud más cercano. NeoCare no reemplaza " +
      "la atención médica profesional.",
    followUp: "No esperes: el tiempo es crítico.",
  },
};

/**
 * Normaliza el objeto de signos (venga como objeto {key: bool} o como
 * arreglo de strings) y devuelve un Set con los IDs de signos presentes.
 */
const extraerSignosActivos = (signos) => {
  const activos = new Set();
  if (!signos) return activos;

  // Tabla de alias (lowercase) -> id canónico del catálogo
  const aliasToId = {};
  for (const id of Object.keys(SIGNS_CATALOG)) {
    aliasToId[id.toLowerCase()] = id;
    const label = SIGNS_CATALOG[id].label;
    aliasToId[label.toLowerCase()] = id;
  }

  if (Array.isArray(signos)) {
    signos.forEach((item) => {
      const s = String(item ?? "").trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const id = aliasToId[s];
      if (id) activos.add(id);
    });
    return activos;
  }

  if (typeof signos === "object") {
    Object.entries(signos).forEach(([key, value]) => {
      if (!isYes(value)) return;
      const k = key.trim();
      if (SIGNS_CATALOG[k]) {
        activos.add(k);
        return;
      }
      const kl = k.toLowerCase();
      const id = aliasToId[kl];
      if (id) activos.add(id);
    });
  }

  return activos;
};

/**
 * Calcula clasificación de triaje a partir de los signos del recién nacido.
 * @param {Object|Array} signos - signos reportados
 * @returns {{puntuacion:number,nivel:string,color:string,signos:Array,recomendaciones:Object}}
 */
export const calcularTriaje = (signos) => {
  const activos = extraerSignosActivos(signos);
  const lista = Array.from(activos).map((id) => ({
    id,
    ...SIGNS_CATALOG[id],
  }));

  const puntuacion = lista.reduce((sum, s) => sum + s.points, 0);
  const hasAlto = lista.some((s) => s.category === "alto");

  let nivel = "Bajo";
  if (hasAlto || puntuacion >= 6) nivel = "Alto";
  else if (puntuacion >= 3) nivel = "Moderado";

  return {
    puntuacion,
    nivel,
    color: RISK_COLORS[nivel],
    signos: lista,
    recomendaciones: RECOMMENDATIONS[nivel],
  };
};

/**
 * Lista completa del catálogo (para que el frontend pueda renderizar el
 * módulo educativo con todos los signos y su puntaje).
 */
export const listarCatalogoSignos = () => {
  return Object.entries(SIGNS_CATALOG).map(([id, value]) => ({
    id,
    ...value,
  }));
};

export const TRIAGE_META = {
  ranges: [
    { min: 0, max: 2, level: "Bajo", color: RISK_COLORS.Bajo },
    { min: 3, max: 5, level: "Moderado", color: RISK_COLORS.Moderado },
    { min: 6, max: 99, level: "Alto", color: RISK_COLORS.Alto },
  ],
  recommendations: RECOMMENDATIONS,
};
