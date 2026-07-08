import { query } from "../db.js";
import {
  calcularTriaje,
  listarCatalogoSignos,
  TRIAGE_META,
} from "../services/triajeEducativoService.js";
import {
  clasificarDiaSeguimiento,
  resumirSeguimiento,
  SEGUIMIENTO_META,
} from "../services/seguimientoService.js";
import {
  generarPlanVacunas,
  generarPlanControles,
  clasificarPeso,
  edadEnMeses,
  VACUNAS_META,
} from "../services/vacunasControlesService.js";

const obtenerMadreIdAutenticada = (req) => {
  const id =
    req.user?.id ||
    req.user?.userId ||
    req.user?.usuarioId ||
    req.user?.usuario_id ||
    req.user?.madreId ||
    req.user?.madre_id ||
    req.user?.sub;

  return id || null;
};

const formatFecha = (fecha) => {
  if (!fecha) return null;

  const f = fecha instanceof Date ? fecha : new Date(fecha);

  if (Number.isNaN(f.getTime())) return null;

  const dd = String(f.getDate()).padStart(2, "0");
  const mm = String(f.getMonth() + 1).padStart(2, "0");
  const yyyy = f.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;

  const fn = new Date(fechaNacimiento);

  if (Number.isNaN(fn.getTime())) return null;

  const hoy = new Date();

  let años = hoy.getFullYear() - fn.getFullYear();
  let meses = hoy.getMonth() - fn.getMonth();
  let dias = hoy.getDate() - fn.getDate();

  if (dias < 0) {
    meses -= 1;
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    dias += ultimoDia;
  }

  if (meses < 0) {
    años -= 1;
    meses += 12;
  }

  if (años === 0 && meses === 0) {
    return `${dias} ${dias === 1 ? "día" : "días"}`;
  }

  if (años === 0) {
    return dias === 0
      ? `${meses} meses`
      : `${meses} meses y ${dias} ${dias === 1 ? "día" : "días"}`;
  }

  if (meses === 0) {
    return dias === 0
      ? `${años} años`
      : `${años} años y ${dias} ${dias === 1 ? "día" : "días"}`;
  }

  return dias === 0
    ? `${años} años y ${meses} meses`
    : `${años} años, ${meses} meses y ${dias} ${
        dias === 1 ? "día" : "días"
      }`;
};

const calcularDiasDesdeNacimiento = (fechaNacimiento) => {
  if (!fechaNacimiento) return "Sin registro";

  const fecha = new Date(fechaNacimiento);

  if (Number.isNaN(fecha.getTime())) return "Sin registro";

  const hoy = new Date();

  fecha.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);

  const diffMs = hoy - fecha;
  const dias = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return `${dias} ${dias === 1 ? "día" : "días"}`;
};

const normalizarNivel = (nivel) => {
  const n = String(nivel || "").trim().toLowerCase();

  if (n.includes("alto")) return "alto";
  if (n.includes("medio") || n.includes("moderado")) return "medio";
  if (n.includes("bajo")) return "bajo";

  return "";
};

const obtenerNivelTexto = (nivel) => {
  const n = normalizarNivel(nivel);

  if (n === "alto") return "Alto";
  if (n === "medio") return "Moderado";
  if (n === "bajo") return "Bajo";

  return "Sin clasificar";
};

const obtenerRecomendacionPorNivel = (nivel) => {
  const n = normalizarNivel(nivel);

  if (n === "alto") {
    return "El resultado indica un nivel de riesgo alto. Se recomienda acudir de inmediato a un centro de salud o contactar a un profesional médico, sin esperar una nueva evaluación.";
  }

  if (n === "medio") {
    return "El resultado indica un nivel de riesgo moderado. Se recomienda mantener vigilancia cercana, repetir la evaluación en las próximas 24 horas y consultar a un profesional de salud si los signos persisten o aumentan.";
  }

  if (n === "bajo") {
    return "El resultado indica un nivel de riesgo bajo. Se recomienda continuar con los cuidados básicos en casa, mantener la observación diaria y asistir a los controles correspondientes.";
  }

  return "Aún no hay una evaluación registrada. Realiza una evaluación para generar el nivel de riesgo y recibir una recomendación personalizada.";
};

const verificarPropiedadBebe = async (bebeId, madreId) => {
  const { rows } = await query(
    `
    SELECT id
    FROM recien_nacidos
    WHERE id = $1 AND madre_id = $2
    `,
    [bebeId, madreId]
  );

  return rows.length > 0;
};

const normalizarEvaluacionParaHome = (evaluacion) => {
  if (!evaluacion) return null;

  const nivelBase =
    evaluacion.tipo_evaluacion === "registro"
      ? evaluacion.clasificacion_final
      : evaluacion.nivel_riesgo;

  const recomendacion =
    evaluacion.tipo_evaluacion === "registro"
      ? evaluacion.recomendacion_seguimiento ||
        obtenerRecomendacionPorNivel(nivelBase)
      : obtenerRecomendacionPorNivel(nivelBase);

  const puntuacion =
    evaluacion.tipo_evaluacion === "registro"
      ? Number(evaluacion.puntaje_materno || 0) +
        Number(evaluacion.puntaje_neonatal || 0)
      : evaluacion.puntuacion_total;

  return {
    id: evaluacion.id,
    tipo: evaluacion.tipo_evaluacion,

    bebeId: evaluacion.bebe_id,
    bebe_id: evaluacion.bebe_id,

    madreId: evaluacion.madre_id,
    madre_id: evaluacion.madre_id,

    fecha: formatFecha(evaluacion.fecha_evaluacion),
    fechaEvaluacion: formatFecha(evaluacion.fecha_evaluacion),
    fecha_evaluacion: formatFecha(evaluacion.fecha_evaluacion),

    puntuacion,
    puntuacionTotal: puntuacion,
    puntuacion_total: puntuacion,

    nivel: nivelBase,
    nivelRiesgo: nivelBase,
    nivel_riesgo: nivelBase,
    nivelTexto: obtenerNivelTexto(nivelBase),

    recomendacion,
    recomendaciones: recomendacion,
  };
};

export const listarBebes = async (req, res) => {
  try {
    const madreId = obtenerMadreIdAutenticada(req);

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    const sql = `
      SELECT
        rn.id,
        rn.madre_id,
        rn.nombre_bebe,
        rn.fecha_nacimiento,
        rn.peso_al_nacer,
        rn.edad_gestacional,
        rn.sexo,
        rn.tipo_parto,
        rn.complicaciones_al_nacer,
        rn.hospitalizacion_neonatal,
        m.nombre AS nombre_madre,
        m.telefono AS telefono_madre,
        m.correo_electronico AS correo_madre
      FROM recien_nacidos rn
      LEFT JOIN madres_cuidadores m ON m.id = rn.madre_id
      WHERE rn.madre_id = $1
      ORDER BY rn.id DESC
    `;

    const { rows } = await query(sql, [madreId]);

    const bebes = await Promise.all(
      rows.map(async (b) => {
        const sqlUltimaTriaje = `
          SELECT
            id,
            bebe_id,
            madre_id,
            fecha_evaluacion,
            nivel_riesgo,
            puntuacion_total,
            'triaje' AS tipo_evaluacion
          FROM evaluaciones_riesgo_bebe
          WHERE bebe_id = $1
          ORDER BY fecha_evaluacion DESC, id DESC
          LIMIT 1
        `;

        const { rows: triajeRows } = await query(sqlUltimaTriaje, [b.id]);
        const ultima = triajeRows[0] || null;
        const ultimaNormalizada = normalizarEvaluacionParaHome(ultima);

        return {
          id: b.id,
          madreId: b.madre_id,
          madre_id: b.madre_id,

          nombreBebe: b.nombre_bebe,
          nombre_bebe: b.nombre_bebe,

          fechaNacimiento: formatFecha(b.fecha_nacimiento),
          fecha_nacimiento: formatFecha(b.fecha_nacimiento),

          edadActual: calcularDiasDesdeNacimiento(b.fecha_nacimiento),
          edad_actual: calcularDiasDesdeNacimiento(b.fecha_nacimiento),

          pesoAlNacer: b.peso_al_nacer,
          peso_al_nacer: b.peso_al_nacer,

          edadGestacional: b.edad_gestacional,
          edad_gestacional: b.edad_gestacional,

          sexo: b.sexo,

          tipoParto: b.tipo_parto,
          tipo_parto: b.tipo_parto,

          complicacionesAlNacer: b.complicaciones_al_nacer,
          complicaciones_al_nacer: b.complicaciones_al_nacer,

          hospitalizacionNeonatal: b.hospitalizacion_neonatal,
          hospitalizacion_neonatal: b.hospitalizacion_neonatal,

          madre: {
            id: b.madre_id,
            nombre: b.nombre_madre,
            telefono: b.telefono_madre,
            correo: b.correo_madre,
          },

          ultimaEvaluacion: ultimaNormalizada,
        };
      })
    );

    return res.json({
      total: bebes.length,
      bebes,
      ultimoBebe: bebes[0] || null,
    });
  } catch (error) {
    console.error("Error al listar bebés:", error);

    return res.status(500).json({
      mensaje: "Error al obtener la lista de bebés.",
      error: error.message,
    });
  }
};

export const obtenerResumenUserHome = async (req, res) => {
  try {
    const madreId = obtenerMadreIdAutenticada(req);

    console.log("REQ.USER EN USERHOME:", req.user);
    console.log("MADRE ID USADO EN USERHOME:", madreId);

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    const sqlUsuario = `
      SELECT
        id,
        nombre,
        telefono,
        correo_electronico
      FROM madres_cuidadores
      WHERE id = $1
      LIMIT 1
    `;

    const { rows: usuarioRows } = await query(sqlUsuario, [madreId]);
    const usuario = usuarioRows[0] || null;

    const sqlBebe = `
      SELECT
        id,
        madre_id,
        nombre_bebe,
        fecha_nacimiento,
        peso_al_nacer,
        edad_gestacional,
        sexo,
        tipo_parto,
        complicaciones_al_nacer,
        hospitalizacion_neonatal
      FROM recien_nacidos
      WHERE madre_id = $1
      ORDER BY id DESC
      LIMIT 1
    `;

    const { rows: bebeRows } = await query(sqlBebe, [madreId]);
    const bebe = bebeRows[0] || null;

    const sqlTotalBebes = `
      SELECT COUNT(*)::int AS total
      FROM recien_nacidos
      WHERE madre_id = $1
    `;

    const { rows: totalBebesRows } = await query(sqlTotalBebes, [madreId]);
    const totalBebes = totalBebesRows[0]?.total || 0;

    let ultimaEvaluacion = null;
    let evaluacionesEncontradas = [];

    if (bebe?.id) {
      const sqlEvaluacionRegistro = `
        SELECT
          id,
          madre_id,
          bebe_id,
          fecha_evaluacion,
          clasificacion_final,
          recomendacion_seguimiento,
          puntaje_materno,
          puntaje_neonatal,
          'registro' AS tipo_evaluacion
        FROM evaluaciones_riesgo_registro
        WHERE bebe_id = $1
        ORDER BY fecha_evaluacion DESC, id DESC
        LIMIT 1
      `;

      const { rows: registroRows } = await query(sqlEvaluacionRegistro, [
        bebe.id,
      ]);

      const sqlEvaluacionTriaje = `
        SELECT
          id,
          madre_id,
          bebe_id,
          fecha_evaluacion,
          nivel_riesgo,
          puntuacion_total,
          'triaje' AS tipo_evaluacion
        FROM evaluaciones_riesgo_bebe
        WHERE bebe_id = $1
        ORDER BY fecha_evaluacion DESC, id DESC
        LIMIT 1
      `;

      const { rows: triajeRows } = await query(sqlEvaluacionTriaje, [bebe.id]);

      const evalRegistro = registroRows[0] || null;
      const evalTriaje = triajeRows[0] || null;

      evaluacionesEncontradas = [evalRegistro, evalTriaje].filter(Boolean);

      if (evalRegistro && evalTriaje) {
        const fechaRegistro = new Date(evalRegistro.fecha_evaluacion);
        const fechaTriaje = new Date(evalTriaje.fecha_evaluacion);

        ultimaEvaluacion =
          fechaTriaje > fechaRegistro ? evalTriaje : evalRegistro;
      } else {
        ultimaEvaluacion = evalTriaje || evalRegistro || null;
      }
    }

    const sqlTotalRegistro = `
      SELECT COUNT(*)::int AS total
      FROM evaluaciones_riesgo_registro
      WHERE madre_id = $1
    `;

    const { rows: totalRegistroRows } = await query(sqlTotalRegistro, [
      madreId,
    ]);

    const totalRegistro = totalRegistroRows[0]?.total || 0;

    const sqlTotalTriaje = `
      SELECT COUNT(*)::int AS total
      FROM evaluaciones_riesgo_bebe
      WHERE madre_id = $1
    `;

    const { rows: totalTriajeRows } = await query(sqlTotalTriaje, [madreId]);
    const totalTriaje = totalTriajeRows[0]?.total || 0;

    const totalEvaluaciones = totalRegistro + totalTriaje;

    const ultimaEvaluacionNormalizada =
      normalizarEvaluacionParaHome(ultimaEvaluacion);

    const nivelBase = ultimaEvaluacionNormalizada?.nivel || "";
    const nivelRiesgo = obtenerNivelTexto(nivelBase);
    const recomendacion =
      ultimaEvaluacionNormalizada?.recomendacion ||
      obtenerRecomendacionPorNivel(nivelBase);

    return res.json({
      usuario: {
        id: usuario?.id || madreId,
        nombre: usuario?.nombre || "Usuario",
        telefono: usuario?.telefono || null,
        correo: usuario?.correo_electronico || null,
      },

      bebe: bebe
        ? {
            id: bebe.id,
            madreId: bebe.madre_id,
            madre_id: bebe.madre_id,

            nombreBebe: bebe.nombre_bebe,
            nombre_bebe: bebe.nombre_bebe,

            fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
            fecha_nacimiento: formatFecha(bebe.fecha_nacimiento),

            edadActual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),
            edad_actual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),

            pesoAlNacer: bebe.peso_al_nacer,
            peso_al_nacer: bebe.peso_al_nacer,

            edadGestacional: bebe.edad_gestacional,
            edad_gestacional: bebe.edad_gestacional,

            sexo: bebe.sexo,

            tipoParto: bebe.tipo_parto,
            tipo_parto: bebe.tipo_parto,

            complicacionesAlNacer: bebe.complicaciones_al_nacer,
            complicaciones_al_nacer: bebe.complicaciones_al_nacer,

            hospitalizacionNeonatal: bebe.hospitalizacion_neonatal,
            hospitalizacion_neonatal: bebe.hospitalizacion_neonatal,

            ultimaEvaluacion: ultimaEvaluacionNormalizada,
          }
        : null,

      ultimaEvaluacion: ultimaEvaluacionNormalizada,

      evaluaciones: evaluacionesEncontradas
        .map(normalizarEvaluacionParaHome)
        .filter(Boolean),

      nivelRiesgo,
      recomendacion,

      resumen: {
        totalBebes,
        totalEvaluaciones,
        totalEvaluacionesRegistro: totalRegistro,
        totalEvaluacionesTriaje: totalTriaje,
        seguimientosActivos: totalBebes,
      },
    });
  } catch (error) {
    console.error("Error al obtener resumen de UserHome:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el resumen de inicio del usuario.",
      error: error.message,
    });
  }
};

export const obtenerBebeDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const madreId = obtenerMadreIdAutenticada(req);

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    const sqlBebe = `
      SELECT
        rn.*,
        m.nombre AS nombre_madre,
        m.telefono AS telefono_madre,
        m.correo_electronico AS correo_madre,
        m.edad AS edad_madre
      FROM recien_nacidos rn
      LEFT JOIN madres_cuidadores m ON m.id = rn.madre_id
      WHERE rn.id = $1 AND rn.madre_id = $2
    `;

    const { rows: bebeRows } = await query(sqlBebe, [id, madreId]);

    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const b = bebeRows[0];

    return res.json({
      bebe: {
        id: b.id,
        madreId: b.madre_id,
        madre_id: b.madre_id,

        nombreBebe: b.nombre_bebe,
        nombre_bebe: b.nombre_bebe,

        fechaNacimiento: formatFecha(b.fecha_nacimiento),
        fecha_nacimiento: formatFecha(b.fecha_nacimiento),

        edadActual: calcularDiasDesdeNacimiento(b.fecha_nacimiento),
        edad_actual: calcularDiasDesdeNacimiento(b.fecha_nacimiento),

        pesoAlNacer: b.peso_al_nacer,
        peso_al_nacer: b.peso_al_nacer,

        edadGestacional: b.edad_gestacional,
        edad_gestacional: b.edad_gestacional,

        sexo: b.sexo,

        tipoParto: b.tipo_parto,
        tipo_parto: b.tipo_parto,

        complicacionesAlNacer: b.complicaciones_al_nacer,
        complicaciones_al_nacer: b.complicaciones_al_nacer,

        especificacionComplicaciones: b.especificacion_complicaciones,
        especificacion_complicaciones: b.especificacion_complicaciones,

        hospitalizacionNeonatal: b.hospitalizacion_neonatal,
        hospitalizacion_neonatal: b.hospitalizacion_neonatal,

        motivoHospitalizacion: b.motivo_hospitalizacion,
        motivo_hospitalizacion: b.motivo_hospitalizacion,

        duracionHospitalizacion: b.duracion_hospitalizacion,
        duracion_hospitalizacion: b.duracion_hospitalizacion,

        requirioCuidadosEspeciales: b.requirio_cuidados_especiales,
        requirio_cuidados_especiales: b.requirio_cuidados_especiales,

        tipoCuidadoRecibido: b.tipo_cuidado_recibido,
        tipo_cuidado_recibido: b.tipo_cuidado_recibido,

        madre: {
          id: b.madre_id,
          nombre: b.nombre_madre,
          telefono: b.telefono_madre,
          correo: b.correo_madre,
          edad: b.edad_madre,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener bebé:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el bebé.",
      error: error.message,
    });
  }
};

export const obtenerTriajeBebe = async (req, res) => {
  try {
    const { id } = req.params;
    const madreId = obtenerMadreIdAutenticada(req);

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    const { rows: bebeRows } = await query(
      `
      SELECT id, nombre_bebe, fecha_nacimiento
      FROM recien_nacidos
      WHERE id = $1 AND madre_id = $2
      `,
      [id, madreId]
    );

    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const bebe = bebeRows[0];

    const { rows: evals } = await query(
      `
      SELECT *
      FROM evaluaciones_riesgo_bebe
      WHERE bebe_id = $1
      ORDER BY fecha_evaluacion DESC, id DESC
      `,
      [id]
    );

    const evaluaciones = evals.map((e) => {
      const signos = {
        convulsiones: e.convulsiones,
        dificultadRespiratoria: e.dificultad_respiratoria,
        coloracionAzulada: e.coloracion_azulada,
        fiebreHipotermia: e.fiebre_hipotermia,
        rechazoAlimentacion: e.rechazo_alimentacion,
        disminucionConciencia: e.disminucion_conciencia,
        vomitosRepetitivos: e.vomitos_repetitivos,
        ictericiaProgresiva: e.ictericia_progresiva,
        disminucionActividad: e.disminucion_actividad,
        llantoPersistente: e.llanto_persistente,
        alteracionesSueno: e.alteraciones_sueno,
        disminucionApetito: e.disminucion_apetito,
        irritabilidadOcasional: e.irritabilidad_ocasional,
      };

      const cls = calcularTriaje(signos);

      return {
        id: e.id,
        fecha: formatFecha(e.fecha_evaluacion),
        fechaEvaluacion: formatFecha(e.fecha_evaluacion),
        fecha_evaluacion: formatFecha(e.fecha_evaluacion),

        puntuacion: e.puntuacion_total,
        puntuacionTotal: e.puntuacion_total,
        puntuacion_total: e.puntuacion_total,

        nivel: e.nivel_riesgo,
        nivelRiesgo: e.nivel_riesgo,
        nivel_riesgo: e.nivel_riesgo,
        nivelTexto: obtenerNivelTexto(e.nivel_riesgo),

        signosActivos: cls.signos,
        recomendacion: cls.recomendaciones,
        recomendaciones: cls.recomendaciones,
        color: cls.color,
      };
    });

    return res.json({
      bebe: {
        id: bebe.id,
        nombre: bebe.nombre_bebe,
        nombreBebe: bebe.nombre_bebe,
        nombre_bebe: bebe.nombre_bebe,
        fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
        fecha_nacimiento: formatFecha(bebe.fecha_nacimiento),
        edadActual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),
        edad_actual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),
      },
      meta: TRIAGE_META,
      catalogoSignos: listarCatalogoSignos(),
      evaluaciones,
      ultimaEvaluacion: evaluaciones[0] || null,
    });
  } catch (error) {
    console.error("Error al obtener triaje:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el módulo de triaje.",
      error: error.message,
    });
  }
};

export const obtenerSeguimientoBebe = async (req, res) => {
  try {
    const { id } = req.params;
    const madreId = obtenerMadreIdAutenticada(req);

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    const { rows: bebeRows } = await query(
      `
      SELECT id, nombre_bebe, fecha_nacimiento
      FROM recien_nacidos
      WHERE id = $1 AND madre_id = $2
      `,
      [id, madreId]
    );

    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const bebe = bebeRows[0];

    const { rows: dias } = await query(
      `
      SELECT *
      FROM seguimiento_diario_neonato
      WHERE bebe_id = $1 AND madre_id = $2
      ORDER BY evaluacion_riesgo_id, dia_seguimiento
      `,
      [id, madreId]
    );

    const grupos = {};

    dias.forEach((d) => {
      const k = d.evaluacion_riesgo_id;

      if (!grupos[k]) grupos[k] = [];

      grupos[k].push({
        id: d.id,
        dia: d.dia_seguimiento,
        fecha: formatFecha(d.fecha_registro),
        registro: {
          alimentacion_normal: d.alimentacion_normal,
          alimentacion_rechazo: d.alimentacion_rechazo,
          temperatura_fiebre: d.temperatura_fiebre,
          temperatura_frio: d.temperatura_frio,
          actividad_normal: d.actividad_normal,
          actividad_letargo: d.actividad_letargo,
          respiracion_normal: d.respiracion_normal,
          respiracion_dificultad: d.respiracion_dificultad,
          piel_normal: d.piel_normal,
          piel_alteracion: d.piel_alteracion,
          eliminacion_panales: d.eliminacion_panales,
          eliminacion_deposiciones: d.eliminacion_deposiciones,
          llanto_normal: d.llanto_normal,
          llanto_alteracion: d.llanto_alteracion,
          alarma_convulsiones: d.alarma_convulsiones,
          alarma_vomito: d.alarma_vomito,
          alarma_empeoramiento: d.alarma_empeoramiento,
        },
        resultado: d.resultado_evolucion,
      });
    });

    const triajes = Object.entries(grupos).map(([triajeId, listaDias]) => {
      const clasificados = listaDias.map((d) => ({
        ...d,
        clasificacion: clasificarDiaSeguimiento(d.registro),
      }));

      return {
        evaluacionRiesgoId: Number(triajeId),
        totalDias: listaDias.length,
        dias: clasificados,
        resumen: resumirSeguimiento(listaDias),
      };
    });

    const resumenGlobal = resumirSeguimiento(dias);

    return res.json({
      bebe: {
        id: bebe.id,
        nombre: bebe.nombre_bebe,
        nombreBebe: bebe.nombre_bebe,
        nombre_bebe: bebe.nombre_bebe,
        fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
        fecha_nacimiento: formatFecha(bebe.fecha_nacimiento),
        edadActual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),
        edad_actual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),
      },
      meta: SEGUIMIENTO_META,
      triajes,
      resumenGlobal,
    });
  } catch (error) {
    console.error("Error al obtener seguimiento:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el módulo de seguimiento.",
      error: error.message,
    });
  }
};

export const obtenerVacunasControlesBebe = async (req, res) => {
  try {
    const { id } = req.params;
    const madreId = obtenerMadreIdAutenticada(req);

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    const { rows: bebeRows } = await query(
      `
      SELECT id, nombre_bebe, fecha_nacimiento
      FROM recien_nacidos
      WHERE id = $1 AND madre_id = $2
      `,
      [id, madreId]
    );

    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const bebe = bebeRows[0];
    const fechaNacimiento = new Date(bebe.fecha_nacimiento);

    const { rows: vacunas } = await query(
      `
      SELECT *
      FROM vacunacion_neonato
      WHERE bebe_id = $1
      ORDER BY fecha_programada ASC
      `,
      [id]
    );

    const { rows: controles } = await query(
      `
      SELECT *
      FROM controles_nino_sano
      WHERE bebe_id = $1
      ORDER BY fecha_control ASC
      `,
      [id]
    );

    const planVacunas = generarPlanVacunas(fechaNacimiento, vacunas);
    const planControles = generarPlanControles(fechaNacimiento, controles);

    const mesesEdad = edadEnMeses(fechaNacimiento);
    const ultimoControl = controles[controles.length - 1] || null;

    const crecimiento = ultimoControl
      ? {
          ultimoControl: {
            fecha: formatFecha(ultimoControl.fecha_control),
            pesoKg: ultimoControl.peso_kg,
            tallaCm: ultimoControl.talla_cm,
            perimetroCefalicoCm: ultimoControl.perimetro_cefalico_cm,
            observaciones: ultimoControl.observaciones,
          },
          edadEnMeses: mesesEdad,
          clasificacion: clasificarPeso(mesesEdad, ultimoControl.peso_kg),
        }
      : null;

    return res.json({
      bebe: {
        id: bebe.id,
        nombre: bebe.nombre_bebe,
        nombreBebe: bebe.nombre_bebe,
        nombre_bebe: bebe.nombre_bebe,
        fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
        fecha_nacimiento: formatFecha(bebe.fecha_nacimiento),
        edadActual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),
        edad_actual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),
        edadEnMeses: mesesEdad,
      },
      meta: VACUNAS_META,
      planVacunas,
      planControles,
      crecimiento,
      resumen: {
        totalVacunas: planVacunas.length,
        vacunasAplicadas: planVacunas.filter((v) => v.cumplida).length,
        vacunasPendientes: planVacunas.filter((v) => v.estado === "Pendiente")
          .length,
        vacunasAtrasadas: planVacunas.filter((v) => v.estado === "Atrasada")
          .length,
        totalControles: planControles.length,
        controlesRealizados: planControles.filter((c) => c.realizado).length,
      },
    });
  } catch (error) {
    console.error("Error al obtener vacunas/controles:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el módulo de vacunas y controles.",
      error: error.message,
    });
  }
};

export const obtenerModuloEducativoCompleto = async (req, res) => {
  try {
    const { id } = req.params;
    const madreId = obtenerMadreIdAutenticada(req);

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    const { rows: bebeRows } = await query(
      "SELECT * FROM recien_nacidos WHERE id = $1 AND madre_id = $2",
      [id, madreId]
    );

    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const bebe = bebeRows[0];
    const fechaNacimiento = new Date(bebe.fecha_nacimiento);

    const { rows: evals } = await query(
      `
      SELECT *
      FROM evaluaciones_riesgo_bebe
      WHERE bebe_id = $1
      ORDER BY fecha_evaluacion DESC, id DESC
      `,
      [id]
    );

    const triajeEvaluaciones = evals.map((e) => {
      const signos = {
        convulsiones: e.convulsiones,
        dificultadRespiratoria: e.dificultad_respiratoria,
        coloracionAzulada: e.coloracion_azulada,
        fiebreHipotermia: e.fiebre_hipotermia,
        rechazoAlimentacion: e.rechazo_alimentacion,
        disminucionConciencia: e.disminucion_conciencia,
        vomitosRepetitivos: e.vomitos_repetitivos,
        ictericiaProgresiva: e.ictericia_progresiva,
        disminucionActividad: e.disminucion_actividad,
        llantoPersistente: e.llanto_persistente,
        alteracionesSueno: e.alteraciones_sueno,
        disminucionApetito: e.disminucion_apetito,
        irritabilidadOcasional: e.irritabilidad_ocasional,
      };

      const cls = calcularTriaje(signos);

      return {
        id: e.id,
        fecha: formatFecha(e.fecha_evaluacion),
        nivel: e.nivel_riesgo,
        nivelTexto: obtenerNivelTexto(e.nivel_riesgo),
        puntuacion: e.puntuacion_total,
        recomendacion: cls.recomendaciones,
        color: cls.color,
      };
    });

    const { rows: dias } = await query(
      `
      SELECT *
      FROM seguimiento_diario_neonato
      WHERE bebe_id = $1 AND madre_id = $2
      ORDER BY evaluacion_riesgo_id, dia_seguimiento
      `,
      [id, madreId]
    );

    const gruposSeg = {};

    dias.forEach((d) => {
      const k = d.evaluacion_riesgo_id;

      if (!gruposSeg[k]) gruposSeg[k] = [];

      gruposSeg[k].push(d);
    });

    const triajesSeguimiento = Object.entries(gruposSeg).map(
      ([triajeId, listaDias]) => {
        const clasificados = listaDias.map((d) => {
          const registro = {
            alimentacion_normal: d.alimentacion_normal,
            alimentacion_rechazo: d.alimentacion_rechazo,
            temperatura_fiebre: d.temperatura_fiebre,
            temperatura_frio: d.temperatura_frio,
            actividad_normal: d.actividad_normal,
            actividad_letargo: d.actividad_letargo,
            respiracion_normal: d.respiracion_normal,
            respiracion_dificultad: d.respiracion_dificultad,
            piel_normal: d.piel_normal,
            piel_alteracion: d.piel_alteracion,
            eliminacion_panales: d.eliminacion_panales,
            eliminacion_deposiciones: d.eliminacion_deposiciones,
            llanto_normal: d.llanto_normal,
            llanto_alteracion: d.llanto_alteracion,
            alarma_convulsiones: d.alarma_convulsiones,
            alarma_vomito: d.alarma_vomito,
            alarma_empeoramiento: d.alarma_empeoramiento,
          };

          return {
            id: d.id,
            dia: d.dia_seguimiento,
            fecha: formatFecha(d.fecha_registro),
            registro,
            resultado: d.resultado_evolucion,
            clasificacion: clasificarDiaSeguimiento(registro),
          };
        });

        return {
          evaluacionRiesgoId: Number(triajeId),
          totalDias: listaDias.length,
          dias: clasificados,
          resumen: resumirSeguimiento(listaDias),
        };
      }
    );

    const resumenGlobal = resumirSeguimiento(dias);

    const { rows: vacunas } = await query(
      "SELECT * FROM vacunacion_neonato WHERE bebe_id = $1",
      [id]
    );

    const { rows: controles } = await query(
      "SELECT * FROM controles_nino_sano WHERE bebe_id = $1",
      [id]
    );

    const planVacunas = generarPlanVacunas(fechaNacimiento, vacunas);
    const planControles = generarPlanControles(fechaNacimiento, controles);

    const mesesEdad = edadEnMeses(fechaNacimiento);
    const ultimoControl = controles[controles.length - 1] || null;

    const crecimiento = ultimoControl
      ? {
          ultimoControl: {
            fecha: formatFecha(ultimoControl.fecha_control),
            pesoKg: ultimoControl.peso_kg,
            tallaCm: ultimoControl.talla_cm,
            perimetroCefalicoCm: ultimoControl.perimetro_cefalico_cm,
          },
          edadEnMeses: mesesEdad,
          clasificacion: clasificarPeso(mesesEdad, ultimoControl.peso_kg),
        }
      : null;

    return res.json({
      bebe: {
        id: bebe.id,
        nombre: bebe.nombre_bebe,
        nombreBebe: bebe.nombre_bebe,
        nombre_bebe: bebe.nombre_bebe,
        fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
        fecha_nacimiento: formatFecha(bebe.fecha_nacimiento),
        edadActual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),
        edad_actual: calcularDiasDesdeNacimiento(bebe.fecha_nacimiento),
        pesoAlNacer: bebe.peso_al_nacer,
        peso_al_nacer: bebe.peso_al_nacer,
        edadGestacional: bebe.edad_gestacional,
        edad_gestacional: bebe.edad_gestacional,
        sexo: bebe.sexo,
      },
      triaje: {
        meta: TRIAGE_META,
        catalogoSignos: listarCatalogoSignos(),
        evaluaciones: triajeEvaluaciones,
        ultimaEvaluacion: triajeEvaluaciones[0] || null,
      },
      seguimiento: {
        meta: SEGUIMIENTO_META,
        resumen: resumenGlobal,
        totalDiasRegistrados: dias.length,
        triajes: triajesSeguimiento,
      },
      vacunasControles: {
        meta: VACUNAS_META,
        planVacunas,
        planControles,
        crecimiento,
        resumen: {
          totalVacunas: planVacunas.length,
          vacunasAplicadas: planVacunas.filter((v) => v.cumplida).length,
          vacunasPendientes: planVacunas.filter(
            (v) => v.estado === "Pendiente"
          ).length,
          vacunasAtrasadas: planVacunas.filter(
            (v) => v.estado === "Atrasada"
          ).length,
          totalControles: planControles.length,
          controlesRealizados: planControles.filter((c) => c.realizado).length,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener módulo educativo:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el módulo educativo del bebé.",
      error: error.message,
    });
  }
};

export const guardarTriajeBebe = async (req, res) => {
  try {
    const { id } = req.params;
    const madreId = obtenerMadreIdAutenticada(req);
    const { signos } = req.body;

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    if (!signos) {
      return res.status(400).json({ mensaje: "Los signos son obligatorios." });
    }

    const pertenece = await verificarPropiedadBebe(id, madreId);

    if (!pertenece) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const resTriaje = calcularTriaje(signos);

    const convulsiones = Boolean(signos.convulsiones);
    const dificultad_respiratoria = Boolean(
      signos.dificultadRespiratoria || signos.dificultad_respiratoria
    );
    const coloracion_azulada = Boolean(
      signos.coloracionAzulada || signos.coloracion_azulada
    );
    const fiebre_hipotermia = Boolean(
      signos.fiebreHipotermia || signos.fiebre_hipotermia
    );
    const rechazo_alimentacion = Boolean(
      signos.rechazoAlimentacion || signos.rechazo_alimentacion
    );
    const disminucion_conciencia = Boolean(
      signos.disminucionConciencia || signos.disminucion_conciencia
    );
    const vomitos_repetitivos = Boolean(
      signos.vomitosRepetitivos || signos.vomitos_repetitivos
    );
    const ictericia_progresiva = Boolean(
      signos.ictericiaProgresiva || signos.ictericia_progresiva
    );
    const disminucion_actividad = Boolean(
      signos.disminucionActividad || signos.disminucion_actividad
    );
    const llanto_persistente = Boolean(
      signos.llantoPersistente || signos.llanto_persistente
    );
    const alteraciones_sueno = Boolean(
      signos.alteracionesSueno || signos.alteraciones_sueno
    );
    const disminucion_apetito = Boolean(
      signos.disminucionApetito || signos.disminucion_apetito
    );
    const irritabilidad_ocasional = Boolean(
      signos.irritabilidadOcasional || signos.irritabilidad_ocasional
    );

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
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17
      )
      RETURNING id
    `;

    const { rows } = await query(sql, [
      id,
      madreId,
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
      resTriaje.puntuacion,
      resTriaje.nivel,
    ]);

    const triajeId = rows[0]?.id;

    return res.status(201).json({
      mensaje: "Evaluación de triaje guardada correctamente.",
      triajeId,
      evaluacion: {
        id: triajeId,
        puntuacion: resTriaje.puntuacion,
        nivel: resTriaje.nivel,
        nivelTexto: obtenerNivelTexto(resTriaje.nivel),
        recomendaciones: resTriaje.recomendaciones,
        recomendacion: resTriaje.recomendaciones,
        color: resTriaje.color,
      },
    });
  } catch (error) {
    console.error("Error al guardar triaje:", error);

    return res.status(500).json({
      mensaje: "Error al guardar la evaluación de triaje.",
      error: error.message,
    });
  }
};

export const guardarSeguimientoBebe = async (req, res) => {
  try {
    const { id } = req.params;
    const madreId = obtenerMadreIdAutenticada(req);
    const { evaluacionRiesgoId, diaSeguimiento, registro } = req.body;

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    if (!evaluacionRiesgoId || !diaSeguimiento || !registro) {
      return res.status(400).json({
        mensaje: "Faltan parámetros obligatorios en el cuerpo del seguimiento.",
      });
    }

    const pertenece = await verificarPropiedadBebe(id, madreId);

    if (!pertenece) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const resultadoDia = clasificarDiaSeguimiento(registro);

    const sql = `
      INSERT INTO seguimiento_diario_neonato (
        bebe_id,
        madre_id,
        evaluacion_riesgo_id,
        dia_seguimiento,
        alimentacion_normal,
        alimentacion_rechazo,
        temperatura_fiebre,
        temperatura_frio,
        actividad_normal,
        actividad_letargo,
        respiracion_normal,
        respiracion_dificultad,
        piel_normal,
        piel_alteracion,
        eliminacion_panales,
        eliminacion_deposiciones,
        llanto_normal,
        llanto_alteracion,
        alarma_convulsiones,
        alarma_vomito,
        alarma_empeoramiento,
        resultado_evolucion
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22
      )
      RETURNING id
    `;

    const { rows } = await query(sql, [
      id,
      madreId,
      evaluacionRiesgoId,
      diaSeguimiento,
      registro.alimentacion_normal,
      registro.alimentacion_rechazo,
      registro.temperatura_fiebre,
      registro.temperatura_frio,
      registro.actividad_normal,
      registro.actividad_letargo,
      registro.respiracion_normal,
      registro.respiracion_dificultad,
      registro.piel_normal,
      registro.piel_alteracion,
      registro.eliminacion_panales,
      registro.eliminacion_deposiciones,
      registro.llanto_normal,
      registro.llanto_alteracion,
      registro.alarma_convulsiones,
      registro.alarma_vomito,
      registro.alarma_empeoramiento,
      resultadoDia.resultado,
    ]);

    const seguimientoId = rows[0]?.id;

    return res.status(201).json({
      mensaje: "Seguimiento diario registrado correctamente.",
      seguimientoId,
      resultado: {
        resultado: resultadoDia.resultado,
        color: resultadoDia.color,
        recomendacion: resultadoDia.recomendacion,
      },
    });
  } catch (error) {
    console.error("Error al guardar seguimiento:", error);

    return res.status(500).json({
      mensaje: "Error al registrar el seguimiento diario.",
      error: error.message,
    });
  }
};

export const guardarControlBebe = async (req, res) => {
  try {
    const { id } = req.params;
    const madreId = obtenerMadreIdAutenticada(req);
    const {
      fechaControl,
      pesoKg,
      tallaCm,
      perimetroCefalicoCm,
      observaciones,
      estado,
    } = req.body;

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    if (!fechaControl || !pesoKg || !tallaCm || !perimetroCefalicoCm) {
      return res.status(400).json({
        mensaje:
          "Faltan datos obligatorios del control (fecha, peso, talla, perímetro cefálico).",
      });
    }

    const pertenece = await verificarPropiedadBebe(id, madreId);

    if (!pertenece) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const sql = `
      INSERT INTO controles_nino_sano (
        bebe_id,
        madre_id,
        fecha_control,
        peso_kg,
        talla_cm,
        perimetro_cefalico_cm,
        observaciones,
        estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const { rows } = await query(sql, [
      id,
      madreId,
      fechaControl,
      pesoKg,
      tallaCm,
      perimetroCefalicoCm,
      observaciones,
      estado || "Realizado",
    ]);

    return res.status(201).json({
      mensaje: "Control de niño sano registrado correctamente.",
      controlId: rows[0]?.id,
    });
  } catch (error) {
    console.error("Error al guardar control:", error);

    return res.status(500).json({
      mensaje: "Error al registrar el control de niño sano.",
      error: error.message,
    });
  }
};

export const actualizarEstadoVacuna = async (req, res) => {
  try {
    const { id } = req.params;
    const madreId = obtenerMadreIdAutenticada(req);
    const { nombreVacuna, dosis, fechaAplicacion, estado } = req.body;

    if (!madreId) {
      return res.status(401).json({ mensaje: "Autenticación requerida." });
    }

    if (!nombreVacuna || !dosis) {
      return res.status(400).json({
        mensaje: "Nombre de vacuna y dosis son obligatorios.",
      });
    }

    const pertenece = await verificarPropiedadBebe(id, madreId);

    if (!pertenece) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const sqlBuscar = `
      SELECT id
      FROM vacunacion_neonato
      WHERE bebe_id = $1 AND nombre_vacuna = $2 AND dosis = $3
    `;

    const { rows: vacRows } = await query(sqlBuscar, [
      id,
      nombreVacuna,
      dosis,
    ]);

    if (vacRows.length > 0) {
      const sqlUpdate = `
        UPDATE vacunacion_neonato
        SET fecha_aplicacion = $1, estado = $2
        WHERE id = $3
      `;

      await query(sqlUpdate, [
        fechaAplicacion,
        estado || "Aplicada",
        vacRows[0].id,
      ]);

      return res.json({
        mensaje: "Estado de vacunación actualizado correctamente.",
        vacunaId: vacRows[0].id,
      });
    }

    const fechaProgramada =
      req.body.fechaProgramada || new Date().toISOString().slice(0, 10);

    const sqlInsert = `
      INSERT INTO vacunacion_neonato (
        bebe_id,
        nombre_vacuna,
        dosis,
        fecha_programada,
        fecha_aplicacion,
        estado
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const { rows } = await query(sqlInsert, [
      id,
      nombreVacuna,
      dosis,
      fechaProgramada,
      fechaAplicacion,
      estado || "Aplicada",
    ]);

    return res.status(201).json({
      mensaje: "Vacunación registrada correctamente.",
      vacunaId: rows[0]?.id,
    });
  } catch (error) {
    console.error("Error al actualizar vacuna:", error);

    return res.status(500).json({
      mensaje: "Error al registrar o actualizar la vacunación.",
      error: error.message,
    });
  }
};