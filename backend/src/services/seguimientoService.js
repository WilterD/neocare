/**
 * Servicio educativo de Seguimiento Diario del Recién Nacido.
 *
 * Replica el contrato de la tabla seguimiento_diario_neonato:
 *   - 5 días posteriores a un triaje
 *   - 16 ítems (Mejoró / Igual / Empeoró)
 *   - Resultado: Verde, Amarillo, Rojo
 *
 * Reglas para clasificar el día (idénticas a las del modelo de BD):
 *   - Cualquier ítem "Empeoró" => Rojo
 *   - >=3 ítems "Igual"       => Amarillo
 *   - Resto                    => Verde
 */

export const ITEMS_SEGUIMIENTO = [
  { id: "alimentacion_normal", label: "Se alimenta con normalidad" },
  { id: "alimentacion_rechazo", label: "Rechazo alimentario" },
  { id: "temperatura_fiebre", label: "Fiebre" },
  { id: "temperatura_frio", label: "Hipotermia" },
  { id: "actividad_normal", label: "Actividad habitual" },
  { id: "actividad_letargo", label: "Letargo o somnolencia excesiva" },
  { id: "respiracion_normal", label: "Respiración normal" },
  { id: "respiracion_dificultad", label: "Dificultad respiratoria" },
  { id: "piel_normal", label: "Coloración normal de la piel" },
  { id: "piel_alteracion", label: "Alteraciones en la piel" },
  { id: "eliminacion_panales", label: "Pañales mojados con regularidad" },
  { id: "eliminacion_deposiciones", label: "Deposiciones normales" },
  { id: "llanto_normal", label: "Llanto consolable" },
  { id: "llanto_alteracion", label: "Llanto inconsolable" },
  { id: "alarma_convulsiones", label: "Convulsiones" },
  { id: "alarma_vomito", label: "Vómitos repetitivos" },
  { id: "alarma_empeoramiento", label: "Empeoramiento general" },
];

const VALORES_VALIDOS = ["Mejoró", "Igual", "Empeoró", "Sí", "No"];

const COLOR_POR_RESULTADO = {
  Verde: "#6fa04f",
  Amarillo: "#e0a64a",
  Rojo: "#c64a4a",
};

const RECOMENDACIONES_POR_RESULTADO = {
  Verde: {
    title: "Evolución favorable",
    text:
      "El bebé muestra mejoría o estabilidad. Continúa con la observación " +
      "diaria y los cuidados generales.",
  },
  Amarillo: {
    title: "Vigilancia reforzada",
    text:
      "Hay señales que no han mejorado lo suficiente. Mantente atenta y " +
      "consulta a un profesional de salud en menos de 24 horas.",
  },
  Rojo: {
    title: "Atención médica inmediata",
    text:
      "Se detectaron señales de alarma o empeoramiento. Acude de inmediato " +
      "al centro de salud más cercano.",
  },
};

/**
 * Valida el cuerpo de un día de seguimiento.
 * @throws Error si falta algún campo obligatorio.
 */
export const validarDiaSeguimiento = (data) => {
  const errors = [];
  const out = {};
  for (const item of ITEMS_SEGUIMIENTO) {
    const raw = data?.[item.id];
    if (raw === undefined || raw === null || raw === "") {
      errors.push(`Falta el campo ${item.id}`);
      continue;
    }
    const v = String(raw).trim();
    if (!VALORES_VALIDOS.includes(v)) {
      errors.push(`Valor inválido para ${item.id}: ${v}`);
      continue;
    }
    out[item.id] = v;
  }
  if (errors.length) {
    const err = new Error(errors.join("; "));
    err.statusCode = 400;
    throw err;
  }
  return out;
};

/**
 * Clasifica un día completo de seguimiento.
 * Devuelve { resultado, color, conteo, recomendacion }.
 */
export const clasificarDiaSeguimiento = (registro) => {
  const conteo = { mejoro: 0, igual: 0, empeoro: 0, si: 0, no: 0 };

  for (const item of ITEMS_SEGUIMIENTO) {
    const v = registro[item.id];
    if (v === "Mejoró") conteo.mejoro += 1;
    else if (v === "Igual") conteo.igual += 1;
    else if (v === "Empeoró") conteo.empeoro += 1;
    else if (v === "Sí") conteo.si += 1;
    else if (v === "No") conteo.no += 1;
  }

  let resultado = "Verde";
  if (conteo.empeoro > 0) resultado = "Rojo";
  else if (conteo.igual >= 3) resultado = "Amarillo";

  return {
    resultado,
    color: COLOR_POR_RESULTADO[resultado],
    conteo,
    recomendacion: RECOMENDACIONES_POR_RESULTADO[resultado],
  };
};

/**
 * Resumen agregado de varios días (1 a 5) para un mismo triaje.
 */
export const resumirSeguimiento = (dias = []) => {
  const totalDias = dias.length;
  const distribucion = { Verde: 0, Amarillo: 0, Rojo: 0 };
  let ultimoResultado = "Verde";

  dias.forEach((dia) => {
    const cls = clasificarDiaSeguimiento(dia);
    distribucion[cls.resultado] += 1;
    // El "último" resultado es el de la fecha de registro más reciente.
    ultimoResultado = cls.resultado;
  });

  let tendencia = "Estable";
  if (totalDias >= 2) {
    const ult = dias[dias.length - 1];
    const pen = dias[dias.length - 2];
    const rUlt = clasificarDiaSeguimiento(ult).resultado;
    const rPen = clasificarDiaSeguimiento(pen).resultado;
    const orden = { Verde: 0, Amarillo: 1, Rojo: 2 };
    if (orden[rUlt] < orden[rPen]) tendencia = "Mejora";
    else if (orden[rUlt] > orden[rPen]) tendencia = "Empeora";
  }

  return {
    totalDias,
    distribucion,
    ultimoResultado,
    colorUltimo: COLOR_POR_RESULTADO[ultimoResultado],
    tendencia,
  };
};

export const SEGUIMIENTO_META = {
  totalDias: 5,
  items: ITEMS_SEGUIMIENTO,
  valoresValidos: VALORES_VALIDOS,
  colores: COLOR_POR_RESULTADO,
  recomendaciones: RECOMENDACIONES_POR_RESULTADO,
};
