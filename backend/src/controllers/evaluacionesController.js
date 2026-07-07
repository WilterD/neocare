import { query } from "../db.js";
import { evaluarRegistro } from "../services/riesgoService.js";

const formatFecha = (fecha) => {
  if (!fecha) return null;
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
  if (partes.length !== 3) return fechaStr;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const formatFechaLarga = (fechaStr) => {
  if (!fechaStr) return "";
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const f = new Date(fechaStr);
  if (Number.isNaN(f.getTime())) return fechaStr;
  return `${f.getDate()} ${meses[f.getMonth()]}, ${f.getFullYear()}`;
};

const formatHora = (fechaStr) => {
  if (!fechaStr) return "";
  const f = new Date(fechaStr);
  if (Number.isNaN(f.getTime())) return "";
  return f.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" });
};

const mapNivelToRisk = (nivel) => {
  const n = String(nivel || "").toLowerCase();
  if (n === "bajo") return { risk: "bajo", riskLabel: "Riesgo bajo" };
  if (n === "medio" || n === "moderado") return { risk: "medio", riskLabel: "Riesgo medio" };
  if (n === "alto") return { risk: "alto", riskLabel: "Riesgo alto" };
  return { risk: "bajo", riskLabel: "Riesgo bajo" };
};

const trackingTypeFromRisk = (nivel) => {
  const n = String(nivel || "").toLowerCase();
  if (n === "alto") return "Atención prioritaria";
  if (n === "medio" || n === "moderado") return "Seguimiento clínico";
  return "Seguimiento básico";
};

const normalizarNivelTriaje = (nivel) => {
  const n = String(nivel || "Bajo").trim();
  if (/^medio$/i.test(n)) return "Moderado";
  if (/^moderado$/i.test(n)) return "Moderado";
  if (/^alto$/i.test(n)) return "Alto";
  return "Bajo";
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  const fn = new Date(fechaNacimiento);
  if (Number.isNaN(fn.getTime())) return null;
  const hoy = new Date();
  const diffMs = hoy - fn;
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (dias <= 0) return "0 días";
  if (dias === 1) return "1 día";
  return `${dias} días`;
};

export const listarMisEvaluaciones = async (req, res) => {
  try {
    const madreId = req.user.id;

    const { rows: bebes } = await query(
      "SELECT id, nombre_bebe, fecha_nacimiento FROM recien_nacidos WHERE madre_id = $1",
      [madreId]
    );

    const bebeMap = Object.fromEntries(
      bebes.map((b) => [b.id, b])
    );

    const { rows: evalRegistro } = await query(
      `SELECT * FROM evaluaciones_riesgo_registro
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
      const score = (e.puntaje_materno || 0) + (e.puntaje_neonatal || 0);
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
        score: `${e.puntuacion_total || 0} / 13`,
        risk: mapped.risk,
        riskLabel: mapped.riskLabel,
        trackingType: trackingTypeFromRisk(e.nivel_riesgo),
        recommendation: "Revisar signos de alarma y repetir evaluación según indicación.",
      };
    });

    const evaluaciones = [...fromRegistro, ...fromTriaje].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const ultima = evaluaciones[0] || null;

    return res.json({
      total: evaluaciones.length,
      evaluaciones,
      ultimaEvaluacion: ultima,
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
    const { bebeId, signos, resultado, nivelRiesgo, puntuacionTotal } = req.body;

    if (!bebeId) {
      return res.status(400).json({ mensaje: "bebeId es obligatorio." });
    }

    const { rows: bebeRows } = await query(
      "SELECT * FROM recien_nacidos WHERE id = $1 AND madre_id = $2",
      [bebeId, madreId]
    );
    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const bebe = bebeRows[0];

    if (signos && typeof signos === "object") {
      const { calcularTriaje } = await import("../services/triajeEducativoService.js");
      const resTriaje = calcularTriaje(signos);
      const nivelFinal = normalizarNivelTriaje(
        nivelRiesgo || resTriaje.nivel
      );
      const puntuacionFinal =
        puntuacionTotal !== undefined && puntuacionTotal !== null
          ? Number(puntuacionTotal)
          : resTriaje.puntuacion;

      const sql = `
        INSERT INTO evaluaciones_riesgo_bebe (
          bebe_id, madre_id, convulsiones, dificultad_respiratoria, coloracion_azulada,
          fiebre_hipotermia, rechazo_alimentacion, disminucion_conciencia, vomitos_repetitivos,
          ictericia_progresiva, disminucion_actividad, llanto_persistente, alteraciones_sueno,
          disminucion_apetito, irritabilidad_ocasional, puntuacion_total, nivel_riesgo
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING id
      `;

      const bool = (v) => Boolean(v);
      const { rows } = await query(sql, [
        bebeId, madreId,
        bool(signos.convulsiones),
        bool(signos.dificultadRespiratoria || signos.dificultad_respiratoria),
        bool(signos.coloracionAzulada || signos.coloracion_azulada),
        bool(signos.fiebreHipotermia || signos.fiebre_hipotermia),
        bool(signos.rechazoAlimentacion || signos.rechazo_alimentacion),
        bool(signos.disminucionConciencia || signos.disminucion_conciencia),
        bool(signos.vomitosRepetitivos || signos.vomitos_repetitivos),
        bool(signos.ictericiaProgresiva || signos.ictericia_progresiva),
        bool(signos.disminucionActividad || signos.disminucion_actividad),
        bool(signos.llantoPersistente || signos.llanto_persistente),
        bool(signos.alteracionesSueno || signos.alteraciones_sueno),
        bool(signos.disminucionApetito || signos.disminucion_apetito),
        bool(signos.irritabilidadOcasional || signos.irritabilidad_ocasional),
        puntuacionFinal,
        nivelFinal,
      ]);

      return res.status(201).json({
        mensaje: "Evaluación de triaje guardada.",
        evaluacionId: rows[0]?.id,
        resultado: {
          ...resTriaje,
          puntuacion: puntuacionFinal,
          nivel: nivelFinal,
        },
      });
    }

    const { rows: madreRows } = await query(
      "SELECT * FROM madres_cuidadores WHERE id = $1",
      [madreId]
    );
    const madre = madreRows[0];

    const payload = resultado || evaluarRegistro({
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
        fechaNacimiento: bebe.fecha_nacimiento,
      },
      datosClinicos: {
        complicacionesNacer: bebe.complicaciones_al_nacer,
        hospitalizacionNeonatal: bebe.hospitalizacion_neonatal,
      },
    });

    const sqlReg = `
      INSERT INTO evaluaciones_riesgo_registro (
        madre_id, bebe_id, puntaje_materno, clasificacion_materna,
        puntaje_neonatal, clasificacion_neonatal, clasificacion_final, recomendacion_seguimiento
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
    `;

    const { rows } = await query(sqlReg, [
      madreId,
      bebeId,
      payload.puntajeMaterno || 0,
      payload.clasificacionMaterna || "Bajo",
      payload.puntajeNeonatal || 0,
      payload.clasificacionNeonatal || "Bajo",
      payload.clasificacionFinal || "Bajo",
      payload.recomendacionSeguimiento || "",
    ]);

    return res.status(201).json({
      mensaje: "Evaluación de riesgo guardada.",
      evaluacionId: rows[0]?.id,
      resultado: payload,
    });
  } catch (error) {
    console.error("Error al crear evaluación:", error);
    return res.status(500).json({
      mensaje: "Error al guardar evaluación.",
      error: error.message,
    });
  }
};
