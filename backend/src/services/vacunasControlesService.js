/**
 * Servicio educativo de Vacunas y Controles del bebé.
 *
 * Modelo de la BD:
 *   - vacunacion_neonato (id, bebe_id, nombre_vacuna, dosis,
 *     fecha_programada, fecha_aplicacion, estado)
 *   - controles_nino_sano (id, bebe_id, fecha_control, peso_kg,
 *     talla_cm, perimetro_cefalico_cm, observaciones, estado)
 *
 * Este servicio:
 *   1. Devuelve el esquema nacional de vacunación neonatal (información
 *      educativa estándar basada en OPS/OMS y PAI Venezuela).
 *   2. Genera el plan de vacunación personalizado para un bebé,
 *      calculando fechas tentativas a partir de la fecha de nacimiento.
 *   3. Genera el plan de controles de niño sano según la edad actual.
 *   4. Calcula la curva de crecimiento y devuelve la clasificación
 *      percentil-like del bebé según su peso, talla y perímetro cefálico.
 */

const DIAS_MS = 24 * 60 * 60 * 1000;

const calcularEdadEnDias = (fechaNacimiento, refDate = new Date()) => {
  if (!fechaNacimiento) return null;
  const fn = fechaNacimiento instanceof Date
    ? fechaNacimiento
    : new Date(fechaNacimiento);
  if (Number.isNaN(fn.getTime())) return null;
  const diff = Math.floor((refDate.getTime() - fn.getTime()) / DIAS_MS);
  return diff < 0 ? 0 : diff;
};

const formatFecha = (d) => {
  if (!(d instanceof Date)) d = new Date(d);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const sumarDias = (fecha, dias) => {
  const f = new Date(fecha);
  f.setDate(f.getDate() + dias);
  return f;
};

/**
 * Esquema de vacunas de referencia. La edad se expresa en días de vida
 * del recién nacido. La aplicación real depende del PAI local.
 */
export const ESQUEMA_VACUNAS = [
  {
    id: "bcg",
    nombre: "BCG",
    dosis: "Única",
    edadDias: 0,
    descripcion:
      "Protege contra formas graves de tuberculosis. Se aplica al nacer en el hospital.",
    enfermedadPreviene: "Tuberculosis meníngea y miliar",
  },
  {
    id: "hepatitis_b_recien_nacido",
    nombre: "Hepatitis B (RN)",
    dosis: "Primera",
    edadDias: 0,
    descripcion:
      "Primera dosis contra Hepatitis B. Se aplica idealmente en las primeras 24 horas de vida.",
    enfermedadPreviene: "Hepatitis B",
  },
  {
    id: "pentavalente_1",
    nombre: "Pentavalente (1ra dosis)",
    dosis: "Primera",
    edadDias: 60,
    descripcion:
      "Protege contra difteria, tétanos, tosferina, poliomielitis y Haemophilus influenzae tipo b.",
    enfermedadPreviene: "Difteria, Tétanos, Tosferina, Polio, Hib",
  },
  {
    id: "polio_1",
    nombre: "Polio (1ra dosis)",
    dosis: "Primera",
    edadDias: 60,
    descripcion:
      "Primera dosis de polio oral o inactivada según el esquema nacional.",
    enfermedadPreviene: "Poliomielitis",
  },
  {
    id: "rotavirus_1",
    nombre: "Rotavirus (1ra dosis)",
    dosis: "Primera",
    edadDias: 60,
    descripcion:
      "Protege contra diarreas severas por rotavirus. Edad máxima para la primera dosis: 3 meses y 21 días.",
    enfermedadPreviene: "Gastroenteritis por rotavirus",
  },
  {
    id: "neumococo_1",
    nombre: "Neumococo conjugada (1ra dosis)",
    dosis: "Primera",
    edadDias: 60,
    descripcion:
      "Protege contra neumonía, meningitis y otitis por neumococo.",
    enfermedadPreviene: "Infecciones por neumococo",
  },
  {
    id: "pentavalente_2",
    nombre: "Pentavalente (2da dosis)",
    dosis: "Segunda",
    edadDias: 120,
    descripcion: "Segunda dosis de la pentavalente.",
    enfermedadPreviene: "Difteria, Tétanos, Tosferina, Polio, Hib",
  },
  {
    id: "polio_2",
    nombre: "Polio (2da dosis)",
    dosis: "Segunda",
    edadDias: 120,
    descripcion: "Segunda dosis de polio.",
    enfermedadPreviene: "Poliomielitis",
  },
  {
    id: "rotavirus_2",
    nombre: "Rotavirus (2da dosis)",
    dosis: "Segunda",
    edadDias: 120,
    descripcion: "Segunda dosis contra rotavirus.",
    enfermedadPreviene: "Gastroenteritis por rotavirus",
  },
  {
    id: "neumococo_2",
    nombre: "Neumococo conjugada (2da dosis)",
    dosis: "Segunda",
    edadDias: 120,
    descripcion: "Segunda dosis de neumococo.",
    enfermedadPreviene: "Infecciones por neumococo",
  },
  {
    id: "pentavalente_3",
    nombre: "Pentavalente (3ra dosis)",
    dosis: "Tercera",
    edadDias: 180,
    descripcion: "Tercera dosis de pentavalente.",
    enfermedadPreviene: "Difteria, Tétanos, Tosferina, Polio, Hib",
  },
  {
    id: "polio_3",
    nombre: "Polio (3ra dosis)",
    dosis: "Tercera",
    edadDias: 180,
    descripcion: "Tercera dosis de polio.",
    enfermedadPreviene: "Poliomielitis",
  },
  {
    id: "neumococo_3",
    nombre: "Neumococo conjugada (3ra dosis)",
    dosis: "Tercera",
    edadDias: 270,
    descripcion:
      "Tercera dosis de neumococo (refuerzo). Recomendada entre los 9 y 12 meses.",
    enfermedadPreviene: "Infecciones por neumococo",
  },
  {
    id: "srp",
    nombre: "SRP (Triple Viral)",
    dosis: "Primera",
    edadDias: 365,
    descripcion:
      "Protege contra sarampión, rubéola y parotiditis. Se aplica al año de edad.",
    enfermedadPreviene: "Sarampión, Rubéola, Parotiditis",
  },
  {
    id: "fiebre_amarilla",
    nombre: "Fiebre Amarilla",
    dosis: "Única",
    edadDias: 365,
    descripcion:
      "Una dosis al año. Requerida en zonas endémicas según el PAI nacional.",
    enfermedadPreviene: "Fiebre amarilla",
  },
];

/**
 * Plan de controles de niño sano sugerido por OPS/OMS.
 *  edadDias -> descripción del control
 */
export const ESQUEMA_CONTROLES = [
  {
    id: "control_primer_mes",
    edadDias: 7,
    titulo: "Primer control del recién nacido",
    descripcion:
      "Evaluación inicial tras el alta hospitalaria. Verifica peso, talla, perímetro cefálico, alimentación y signos de alarma.",
  },
  {
    id: "control_1_mes",
    edadDias: 30,
    titulo: "Control del mes de vida",
    descripcion:
      "Control de crecimiento y desarrollo. Refuerzo de lactancia materna y orientación a la familia.",
  },
  {
    id: "control_2_meses",
    edadDias: 60,
    titulo: "Control de los 2 meses",
    descripcion:
      "Control de crecimiento, aplicación del esquema de vacunas (2 meses) y tamizaje del desarrollo.",
  },
  {
    id: "control_4_meses",
    edadDias: 120,
    titulo: "Control de los 4 meses",
    descripcion:
      "Control de crecimiento, segunda dosis de vacunas y orientación sobre alimentación complementaria.",
  },
  {
    id: "control_6_meses",
    edadDias: 180,
    titulo: "Control de los 6 meses",
    descripcion:
      "Inicio de alimentación complementaria, control de peso y talla, evaluación del desarrollo motor.",
  },
  {
    id: "control_9_meses",
    edadDias: 270,
    titulo: "Control de los 9 meses",
    descripcion:
      "Refuerzo de vacunas, evaluación del desarrollo y tamizaje de anemia según el caso.",
  },
  {
    id: "control_12_meses",
    edadDias: 365,
    titulo: "Control del año de vida",
    descripcion:
      "Vacunas del año (SRP, fiebre amarilla), evaluación del desarrollo psicomotor y nutrición.",
  },
];

/**
 * Puntos de referencia percentil-like (OMS, simplificado) para la
 * clasificación del estado nutricional. No sustituye el juicio clínico.
 */
const TABLA_PESO_EDAD = [
  // [edadMeses, percentil3, percentil15, percentil50, percentil85, percentil97]
  [0, 2.5, 2.8, 3.3, 3.9, 4.4],
  [1, 3.4, 3.8, 4.5, 5.1, 5.7],
  [2, 4.3, 4.8, 5.6, 6.3, 7.0],
  [3, 5.0, 5.6, 6.4, 7.2, 8.0],
  [4, 5.6, 6.2, 7.0, 7.9, 8.7],
  [5, 6.0, 6.7, 7.5, 8.4, 9.3],
  [6, 6.4, 7.1, 7.9, 8.9, 9.8],
  [9, 7.1, 7.8, 8.7, 9.7, 10.7],
  [12, 7.7, 8.4, 9.4, 10.5, 11.6],
];

const interpolar = (tabla, edadMeses, col) => {
  if (edadMeses <= tabla[0][0]) return tabla[0][col];
  if (edadMeses >= tabla[tabla.length - 1][0])
    return tabla[tabla.length - 1][col];
  for (let i = 0; i < tabla.length - 1; i++) {
    const [m1, p1] = [tabla[i][0], tabla[i][col]];
    const [m2, p2] = [tabla[i + 1][0], tabla[i + 1][col]];
    if (edadMeses >= m1 && edadMeses <= m2) {
      const t = (edadMeses - m1) / (m2 - m1);
      return p1 + (p2 - p1) * t;
    }
  }
  return tabla[tabla.length - 1][col];
};

export const clasificarPeso = (edadMeses, pesoKg) => {
  if (!edadMeses || !pesoKg) return null;
  const p3 = interpolar(TABLA_PESO_EDAD, edadMeses, 1);
  const p15 = interpolar(TABLA_PESO_EDAD, edadMeses, 2);
  const p50 = interpolar(TABLA_PESO_EDAD, edadMeses, 3);
  const p85 = interpolar(TABLA_PESO_EDAD, edadMeses, 4);
  const p97 = interpolar(TABLA_PESO_EDAD, edadMeses, 5);

  let categoria = "Normal";
  if (pesoKg < p3) categoria = "Bajo peso severo";
  else if (pesoKg < p15) categoria = "Bajo peso";
  else if (pesoKg > p97) categoria = "Sobrepeso";
  else if (pesoKg > p85) categoria = "Riesgo de sobrepeso";

  return { p3, p15, p50, p85, p97, categoria };
};

/**
 * Genera el plan completo de vacunas para un bebé, cruzando el esquema
 * nacional con las vacunas ya registradas en la BD.
 */
export const generarPlanVacunas = (fechaNacimiento, vacunasRegistradas = []) => {
  if (!fechaNacimiento) return [];
  const fn = fechaNacimiento instanceof Date
    ? fechaNacimiento
    : new Date(fechaNacimiento);
  if (Number.isNaN(fn.getTime())) return [];
  const edadDias = calcularEdadEnDias(fn);

  return ESQUEMA_VACUNAS.map((v) => {
    const fechaProgramada = sumarDias(fn, v.edadDias);
    const registroExistente = vacunasRegistradas.find(
      (r) => r.nombre_vacuna === v.nombre && r.dosis === v.dosis
    );
    const aplicada = registroExistente?.estado === "Aplicada";
    const atrasada =
      !aplicada && fechaProgramada.getTime() < new Date().setHours(0, 0, 0, 0);
    const estado = aplicada
      ? "Aplicada"
      : atrasada
      ? "Atrasada"
      : "Pendiente";

    return {
      ...v,
      fechaProgramada: formatFecha(fechaProgramada),
      fechaAplicacion: registroExistente?.fecha_aplicacion || null,
      estado,
      edadProgramadaDias: v.edadDias,
      yaVencida: atrasada,
      cumplida: aplicada,
      registroId: registroExistente?.id || null,
      diasRestantes:
        edadDias === null
          ? null
          : Math.max(0, v.edadDias - edadDias),
    };
  });
};

/**
 * Genera el plan de controles de niño sano para un bebé.
 */
export const generarPlanControles = (
  fechaNacimiento,
  controlesRegistrados = []
) => {
  if (!fechaNacimiento) return [];
  const fn = fechaNacimiento instanceof Date
    ? fechaNacimiento
    : new Date(fechaNacimiento);
  if (Number.isNaN(fn.getTime())) return [];

  return ESQUEMA_CONTROLES.map((c) => {
    const fechaProgramada = sumarDias(fn, c.edadDias);
    const registroExistente = controlesRegistrados.find(
      (r) => r.estado === "Realizado"
    );
    return {
      ...c,
      fechaProgramada: formatFecha(fechaProgramada),
      realizado: Boolean(registroExistente),
      registroId: registroExistente?.id || null,
    };
  });
};

/**
 * Calcula la edad en meses con un decimal a partir de la fecha de nacimiento.
 */
export const edadEnMeses = (fechaNacimiento, refDate = new Date()) => {
  const dias = calcularEdadEnDias(fechaNacimiento, refDate);
  if (dias === null) return null;
  return Math.round((dias / 30.4375) * 10) / 10;
};

export const VACUNAS_META = {
  esquema: ESQUEMA_VACUNAS,
};
