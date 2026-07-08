import { query } from "../db.js";
import { evaluarRegistro } from "../services/riesgoService.js";

const formatFecha = (fecha) => {
  if (!fecha) return null;

  if (typeof fecha === "string") {
    const base = fecha.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(base)) return base;
  }

  const f = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(f.getTime())) return String(fecha);

  const dd = String(f.getDate()).padStart(2, "0");
  const mm = String(f.getMonth() + 1).padStart(2, "0");
  const yyyy = f.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};

const formatFechaEs = (fechaStr) => {
  if (!fechaStr) return "";

  const base = String(fechaStr).split("T")[0];
  const partes = base.split("-");

  if (partes.length !== 3) return String(fechaStr);

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const formatFechaLarga = (fechaStr) => {
  if (!fechaStr) return "";

  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const f = new Date(fechaStr);

  if (Number.isNaN(f.getTime())) {
    return formatFechaEs(fechaStr) || String(fechaStr);
  }

  return `${f.getDate()} ${meses[f.getMonth()]}, ${f.getFullYear()}`;
};

const formatHora = (fechaStr) => {
  if (!fechaStr) return "";

  const f = new Date(fechaStr);
  if (Number.isNaN(f.getTime())) return "";

  return f.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizarTexto = (valor) =>
  String(valor ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const toBool = (valor) => {
  if (valor === true || valor === 1) return true;

  if (
    valor === false ||
    valor === 0 ||
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return false;
  }

  const s = normalizarTexto(valor);

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

const getSigno = (signos, camel, snake) => {
  return toBool(signos?.[camel] ?? signos?.[snake]);
};

const mapNivelToRisk = (nivel) => {
  const n = normalizarTexto(nivel);

  if (n === "bajo") {
    return {
      risk: "bajo",
      riskLabel: "Riesgo bajo",
    };
  }

  if (n === "medio" || n === "moderado") {
    return {
      risk: "medio",
      riskLabel: "Riesgo medio",
    };
  }

  if (n === "alto") {
    return {
      risk: "alto",
      riskLabel: "Riesgo alto",
    };
  }

  return {
    risk: "bajo",
    riskLabel: "Riesgo bajo",
  };
};

const trackingTypeFromRisk = (nivel) => {
  const n = normalizarTexto(nivel);

  if (n === "alto") return "Atención prioritaria";

  if (n === "medio" || n === "moderado") return "Seguimiento clínico";

  return "Seguimiento básico";
};

const normalizarNivelRegistro = (nivel) => {
  const n = normalizarTexto(nivel);

  if (n === "alto") return "Alto";

  if (n === "medio" || n === "moderado") return "Medio";

  return "Bajo";
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;

  const fn = new Date(fechaNacimiento);

  if (Number.isNaN(fn.getTime())) return null;

  const hoy = new Date();

  fn.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);

  const diffMs = hoy - fn;
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (dias <= 0) return "0 días";
  if (dias === 1) return "1 día";

  return `${dias} días`;
};

const construirSignosParaBD = (signos) => {
  return {
    convulsiones: getSigno(signos, "convulsiones", "convulsiones"),

    dificultadRespiratoria: getSigno(
      signos,
      "dificultadRespiratoria",
      "dificultad_respiratoria"
    ),

    coloracionAzulada: getSigno(
      signos,
      "coloracionAzulada",
      "coloracion_azulada"
    ),

    fiebreHipotermia: getSigno(
      signos,
      "fiebreHipotermia",
      "fiebre_hipotermia"
    ),

    rechazoAlimentacion: getSigno(
      signos,
      "rechazoAlimentacion",
      "rechazo_alimentacion"
    ),

    disminucionConciencia: getSigno(
      signos,
      "disminucionConciencia",
      "disminucion_conciencia"
    ),

    vomitosRepetitivos: getSigno(
      signos,
      "vomitosRepetitivos",
      "vomitos_repetitivos"
    ),

    ictericiaProgresiva: getSigno(
      signos,
      "ictericiaProgresiva",
      "ictericia_progresiva"
    ),

    disminucionActividad: getSigno(
      signos,
      "disminucionActividad",
      "disminucion_actividad"
    ),

    llantoPersistente: getSigno(
      signos,
      "llantoPersistente",
      "llanto_persistente"
    ),

    alteracionesSueno: getSigno(
      signos,
      "alteracionesSueno",
      "alteraciones_sueno"
    ),

    disminucionApetito: getSigno(
      signos,
      "disminucionApetito",
      "disminucion_apetito"
    ),

    irritabilidadOcasional: getSigno(
      signos,
      "irritabilidadOcasional",
      "irritabilidad_ocasional"
    ),
  };
};

const calcularPuntuacionTriajeBD = (signosBD) => {
  return (
    (signosBD.convulsiones ? 3 : 0) +
    (signosBD.dificultadRespiratoria ? 3 : 0) +
    (signosBD.coloracionAzulada ? 3 : 0) +
    (signosBD.fiebreHipotermia ? 3 : 0) +
    (signosBD.rechazoAlimentacion ? 3 : 0) +
    (signosBD.disminucionConciencia ? 3 : 0) +
    (signosBD.vomitosRepetitivos ? 2 : 0) +
    (signosBD.ictericiaProgresiva ? 2 : 0) +
    (signosBD.disminucionActividad ? 2 : 0) +
    (signosBD.llantoPersistente ? 2 : 0) +
    (signosBD.alteracionesSueno ? 1 : 0) +
    (signosBD.disminucionApetito ? 1 : 0) +
    (signosBD.irritabilidadOcasional ? 1 : 0)
  );
};

const tieneSignoAlto = (signosBD) => {
  return (
    signosBD.convulsiones ||
    signosBD.dificultadRespiratoria ||
    signosBD.coloracionAzulada ||
    signosBD.fiebreHipotermia ||
    signosBD.rechazoAlimentacion ||
    signosBD.disminucionConciencia
  );
};

const normalizarNivelTriajeBD = (signosBD, puntuacion) => {
  if (tieneSignoAlto(signosBD) || puntuacion >= 6) return "Alto";
  if (puntuacion >= 3) return "Moderado";
  return "Bajo";
};

export const listarMisEvaluaciones = async (req, res) => {
  try {
    const madreId = req.user.id;

    const { rows: bebes } = await query(
      "SELECT id, nombre_bebe, fecha_nacimiento FROM recien_nacidos WHERE madre_id = $1",
      [madreId]
    );

    const bebeMap = Object.fromEntries(bebes.map((b) => [b.id, b]));

    const { rows: evalRegistro } = await query(
      `SELECT *
       FROM evaluaciones_riesgo_registro
       WHERE madre_id = $1
       ORDER BY fecha_evaluacion DESC`,
      [madreId]
    );

    const { rows: evalTriaje } = await query(
      `SELECT e.*, rn.nombre_bebe, rn.fecha_nacimiento
       FROM evaluaciones_riesgo_bebe e
       JOIN recien_nacidos rn ON rn.id = e.bebe_id
       WHERE e.madre_id = $1
       ORDER BY e.fecha_evaluacion DESC`,
      [madreId]
    );

    const fromRegistro = evalRegistro.map((e) => {
      const bebe = bebeMap[e.bebe_id] || {};
      const nivel = e.clasificacion_final || "Bajo";
      const mapped = mapNivelToRisk(nivel);
      const maxScore = 20;

      const score =
        Number(e.puntaje_materno || 0) + Number(e.puntaje_neonatal || 0);

      return {
        id: `reg-${e.id}`,
        tipo: "registro",
        bebeId: e.bebe_id,
        bebeNombre: bebe.nombre_bebe || "Bebé",
        createdAt: e.fecha_evaluacion,
        date: formatFechaLarga(e.fecha_evaluacion),
        time: formatHora(e.fecha_evaluacion),
        babyAge: calcularEdad(bebe.fecha_nacimiento) || "—",
        score: `${score} / ${maxScore}`,
        risk: mapped.risk,
        riskLabel: mapped.riskLabel,
        trackingType: trackingTypeFromRisk(nivel),
        recommendation: e.recomendacion_seguimiento || "",
      };
    });

    const fromTriaje = evalTriaje.map((e) => {
      const mapped = mapNivelToRisk(e.nivel_riesgo);

      return {
        id: `tri-${e.id}`,
        tipo: "triaje",
        bebeId: e.bebe_id,
        bebeNombre: e.nombre_bebe || "Bebé",
        createdAt: e.fecha_evaluacion,
        date: formatFechaLarga(e.fecha_evaluacion),
        time: formatHora(e.fecha_evaluacion),
        babyAge: calcularEdad(e.fecha_nacimiento) || "—",
        score: `${e.puntuacion_total || 0} / 29`,
        risk: mapped.risk,
        riskLabel: mapped.riskLabel,
        trackingType: trackingTypeFromRisk(e.nivel_riesgo),
        recommendation:
          "Revisar signos de alarma y repetir evaluación según indicación.",
      };
    });

    const evaluaciones = [...fromRegistro, ...fromTriaje].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
      total: evaluaciones.length,
      evaluaciones,
      ultimaEvaluacion: evaluaciones[0] || null,
      bebes: bebes.map((b) => ({
        id: b.id,
        nombre: b.nombre_bebe,
        edadActual: calcularEdad(b.fecha_nacimiento),
      })),
    });
  } catch (error) {
    console.error("Error al listar evaluaciones:", error);

    return res.status(500).json({
      mensaje: "Error al obtener evaluaciones.",
      error: error.message,
    });
  }
};

export const crearEvaluacion = async (req, res) => {
  try {
    const madreId = req.user.id;

    const {
      bebeId,
      bebe_id,
      signos,
      resultado,
    } = req.body;

    const idBebe = bebeId || bebe_id;

    if (!idBebe) {
      return res.status(400).json({
        mensaje: "bebeId es obligatorio.",
      });
    }

    const { rows: bebeRows } = await query(
      "SELECT * FROM recien_nacidos WHERE id = $1 AND madre_id = $2",
      [idBebe, madreId]
    );

    if (bebeRows.length === 0) {
      return res.status(404).json({
        mensaje: "Bebé no encontrado.",
      });
    }

    const bebe = bebeRows[0];

    if (signos && typeof signos === "object") {
      const { calcularTriaje } = await import(
        "../services/triajeEducativoService.js"
      );

      const signosBD = construirSignosParaBD(signos);
      const resTriajeServicio = calcularTriaje(signos);

      const puntuacionBD = calcularPuntuacionTriajeBD(signosBD);
      const nivelBD = normalizarNivelTriajeBD(signosBD, puntuacionBD);

      const sql = `
        INSERT INTO evaluaciones_riesgo_bebe (
          bebe_id,
          madre_id,
          convulsiones,
          dificultad_respiratoria,
          coloracion_azulada,
          fiebre_hipotermia,
          rechazo_alimentacion,
          disminucion_conciencia,
          vomitos_repetitivos,
          ictericia_progresiva,
          disminucion_actividad,
          llanto_persistente,
          alteraciones_sueno,
          disminucion_apetito,
          irritabilidad_ocasional,
          puntuacion_total,
          nivel_riesgo
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
        )
        RETURNING id
      `;

      const { rows } = await query(sql, [
        idBebe,
        madreId,
        signosBD.convulsiones,
        signosBD.dificultadRespiratoria,
        signosBD.coloracionAzulada,
        signosBD.fiebreHipotermia,
        signosBD.rechazoAlimentacion,
        signosBD.disminucionConciencia,
        signosBD.vomitosRepetitivos,
        signosBD.ictericiaProgresiva,
        signosBD.disminucionActividad,
        signosBD.llantoPersistente,
        signosBD.alteracionesSueno,
        signosBD.disminucionApetito,
        signosBD.irritabilidadOcasional,
        puntuacionBD,
        nivelBD,
      ]);

      return res.status(201).json({
        mensaje: "Evaluación de triaje guardada.",
        evaluacionId: rows[0]?.id,
        resultado: {
          ...resTriajeServicio,
          puntuacion: puntuacionBD,
          nivel: nivelBD,
        },
      });
    }

    const { rows: madreRows } = await query(
      "SELECT * FROM madres_cuidadores WHERE id = $1",
      [madreId]
    );

    if (madreRows.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado.",
      });
    }

    const madre = madreRows[0];

    const payload =
      resultado ||
      evaluarRegistro({
        madre: {
          edad: madre.edad,
          nivelEducativo: madre.nivel_educacion,
          zonaResidencia: madre.zona_residencia,
          accesoCentroSalud: madre.acceso_centro_salud,
          madreSola: madre.es_madre_sola,
          apoyoFamiliar: madre.tiene_apoyo_familiar,
          numeroHijos: madre.numero_hijos,
          situacionEconomica: madre.situacion_economica,
        },
        bebe: {
          edadGestacional: bebe.edad_gestacional,
          pesoNacer: bebe.peso_al_nacer,
          fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
        },
        datosClinicos: {
          complicacionesNacer: bebe.complicaciones_al_nacer,
          hospitalizacionNeonatal: bebe.hospitalizacion_neonatal,
        },
      });

    const sqlReg = `
      INSERT INTO evaluaciones_riesgo_registro (
        madre_id,
        bebe_id,
        puntaje_materno,
        clasificacion_materna,
        puntaje_neonatal,
        clasificacion_neonatal,
        clasificacion_final,
        recomendacion_seguimiento
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
    `;

    const { rows } = await query(sqlReg, [
      madreId,
      idBebe,
      Number(payload.puntajeMaterno || 0),
      normalizarNivelRegistro(payload.clasificacionMaterna),
      Number(payload.puntajeNeonatal || 0),
      normalizarNivelRegistro(payload.clasificacionNeonatal),
      normalizarNivelRegistro(payload.clasificacionFinal),
      payload.recomendacionSeguimiento || "",
    ]);

    return res.status(201).json({
      mensaje: "Evaluación de riesgo guardada.",
      evaluacionId: rows[0]?.id,
      resultado: {
        ...payload,
        clasificacionMaterna: normalizarNivelRegistro(
          payload.clasificacionMaterna
        ),
        clasificacionNeonatal: normalizarNivelRegistro(
          payload.clasificacionNeonatal
        ),
        clasificacionFinal: normalizarNivelRegistro(payload.clasificacionFinal),
      },
    });
  } catch (error) {
    console.error("Error al crear evaluación:", error);

    return res.status(500).json({
      mensaje: "Error al guardar evaluación.",
      error: error.message,
    });
  }
};