import { query } from "../db.js";
import { calcularTriaje, listarCatalogoSignos, TRIAGE_META } from "../services/triajeEducativoService.js";
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
  if (años === 0 && meses === 0) return `${dias} días`;
  if (años === 0) return dias === 0 ? `${meses} meses` : `${meses} meses y ${dias} días`;
  if (meses === 0) return dias === 0 ? `${años} años` : `${años} años y ${dias} días`;
  return dias === 0
    ? `${años} años y ${meses} meses`
    : `${años} años, ${meses} meses y ${dias} días`;
};

/**
 * GET /api/bebes
 * Devuelve la lista de todos los recién nacidos con datos resumidos
 * de su madre y la última evaluación de riesgo.
 */
export const listarBebes = async (req, res) => {
  try {
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
        m.nombre        AS nombre_madre,
        m.telefono      AS telefono_madre,
        m.correo_electronico AS correo_madre
      FROM recien_nacidos rn
      LEFT JOIN madres_cuidadores m ON m.id = rn.madre_id
      ORDER BY rn.creado_en DESC
    `;
    const { rows } = await query(sql);

    // Buscar la última evaluación de riesgo de cada bebé (N+1 tolerable:
    //  los volúmenes esperados son bajos y la operación es indexada por bebe_id).
    const bebes = await Promise.all(
      rows.map(async (b) => {
        const sqlUlt = `
          SELECT id, fecha_evaluacion, nivel_riesgo, puntuacion_total
          FROM evaluaciones_riesgo_bebe
          WHERE bebe_id = $1
          ORDER BY fecha_evaluacion DESC
          LIMIT 1
        `;
        const { rows: ultRows } = await query(sqlUlt, [b.id]);

        return {
          id: b.id,
          madreId: b.madre_id,
          nombreBebe: b.nombre_bebe,
          fechaNacimiento: formatFecha(b.fecha_nacimiento),
          edadActual: calcularEdad(b.fecha_nacimiento),
          pesoAlNacer: b.peso_al_nacer,
          edadGestacional: b.edad_gestacional,
          sexo: b.sexo,
          tipoParto: b.tipo_parto,
          complicacionesAlNacer: b.complicaciones_al_nacer,
          hospitalizacionNeonatal: b.hospitalizacion_neonatal,
          madre: {
            id: b.madre_id,
            nombre: b.nombre_madre,
            telefono: b.telefono_madre,
            correo: b.correo_madre,
          },
          ultimaEvaluacion: ultRows[0]
            ? {
                id: ultRows[0].id,
                fecha: formatFecha(ultRows[0].fecha_evaluacion),
                nivel: ultRows[0].nivel_riesgo,
                puntuacion: ultRows[0].puntuacion_total,
              }
            : null,
        };
      })
    );

    return res.json({
      total: bebes.length,
      bebes,
    });
  } catch (error) {
    console.error("Error al listar bebés:", error);
    return res.status(500).json({
      mensaje: "Error al obtener la lista de bebés.",
      error: error.message,
    });
  }
};

/**
 * GET /api/bebes/:id
 * Devuelve el detalle completo de un bebé + madre.
 */
export const obtenerBebeDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const sqlBebe = `
      SELECT rn.*, m.nombre AS nombre_madre, m.telefono AS telefono_madre,
             m.correo_electronico AS correo_madre, m.edad AS edad_madre
      FROM recien_nacidos rn
      LEFT JOIN madres_cuidadores m ON m.id = rn.madre_id
      WHERE rn.id = $1
    `;
    const { rows: bebeRows } = await query(sqlBebe, [id]);
    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }
    const b = bebeRows[0];
    const detalle = {
      id: b.id,
      madreId: b.madre_id,
      nombreBebe: b.nombre_bebe,
      fechaNacimiento: formatFecha(b.fecha_nacimiento),
      edadActual: calcularEdad(b.fecha_nacimiento),
      pesoAlNacer: b.peso_al_nacer,
      edadGestacional: b.edad_gestacional,
      sexo: b.sexo,
      tipoParto: b.tipo_parto,
      complicacionesAlNacer: b.complicaciones_al_nacer,
      especificacionComplicaciones: b.especificacion_complicaciones,
      hospitalizacionNeonatal: b.hospitalizacion_neonatal,
      motivoHospitalizacion: b.motivo_hospitalizacion,
      duracionHospitalizacion: b.duracion_hospitalizacion,
      requirioCuidadosEspeciales: b.requirio_cuidados_especiales,
      tipoCuidadoRecibido: b.tipo_cuidado_recibido,
      madre: {
        id: b.madre_id,
        nombre: b.nombre_madre,
        telefono: b.telefono_madre,
        correo: b.correo_madre,
        edad: b.edad_madre,
      },
    };

    return res.json({ bebe: detalle });
  } catch (error) {
    console.error("Error al obtener bebé:", error);
    return res.status(500).json({
      mensaje: "Error al obtener el bebé.",
      error: error.message,
    });
  }
};

/**
 * GET /api/bebes/:id/triaje
 * Devuelve el módulo educativo "Sistema de triaje neonatal":
 *   - historial de evaluaciones de riesgo del bebé
 *   - catálogo completo de signos
 *   - última evaluación clasificada
 */
export const obtenerTriajeBebe = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar bebé
    const { rows: bebeRows } = await query(
      "SELECT id, nombre_bebe, fecha_nacimiento FROM recien_nacidos WHERE id = $1",
      [id]
    );
    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }
    const bebe = bebeRows[0];

    // Traer todas las evaluaciones
    const { rows: evals } = await query(
      `SELECT * FROM evaluaciones_riesgo_bebe
       WHERE bebe_id = $1
       ORDER BY fecha_evaluacion DESC`,
      [id]
    );

    const evaluaciones = evals.map((e) => {
      // Reconstruir el objeto de signos a partir de los booleanos de la BD
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
        puntuacion: e.puntuacion_total,
        nivel: e.nivel_riesgo,
        signosActivos: cls.signos,
        recomendacion: cls.recomendaciones,
        color: cls.color,
      };
    });

    return res.json({
      bebe: {
        id: bebe.id,
        nombre: bebe.nombre_bebe,
        fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
        edadActual: calcularEdad(bebe.fecha_nacimiento),
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

/**
 * GET /api/bebes/:id/seguimiento
 * Devuelve el módulo educativo "Seguimiento diario del recién nacido":
 *   - todos los días registrados (1..5) por evaluación de triaje
 *   - resumen consolidado
 */
export const obtenerSeguimientoBebe = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows: bebeRows } = await query(
      "SELECT id, nombre_bebe, fecha_nacimiento FROM recien_nacidos WHERE id = $1",
      [id]
    );
    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }
    const bebe = bebeRows[0];

    const { rows: dias } = await query(
      `SELECT * FROM seguimiento_diario_neonato
       WHERE bebe_id = $1
       ORDER BY evaluacion_riesgo_id, dia_seguimiento`,
      [id]
    );

    // Agrupar por evaluación de triaje
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
      const resumen = resumirSeguimiento(listaDias);
      return {
        evaluacionRiesgoId: Number(triajeId),
        totalDias: listaDias.length,
        dias: clasificados,
        resumen,
      };
    });

    // Resumen global
    const todosLosDias = dias;
    const resumenGlobal = resumirSeguimiento(todosLosDias);

    return res.json({
      bebe: {
        id: bebe.id,
        nombre: bebe.nombre_bebe,
        fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
        edadActual: calcularEdad(bebe.fecha_nacimiento),
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

/**
 * GET /api/bebes/:id/vacunas-controles
 * Devuelve el módulo educativo "Vacunas y controles del bebé":
 *   - plan completo de vacunación cruzado con la BD
 *   - plan de controles de niño sano
 *   - curva de crecimiento percentil-like del último control
 */
export const obtenerVacunasControlesBebe = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows: bebeRows } = await query(
      "SELECT id, nombre_bebe, fecha_nacimiento FROM recien_nacidos WHERE id = $1",
      [id]
    );
    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }
    const bebe = bebeRows[0];
    const fechaNacimiento = new Date(bebe.fecha_nacimiento);

    // Vacunas registradas
    const { rows: vacunas } = await query(
      `SELECT * FROM vacunacion_neonato
       WHERE bebe_id = $1
       ORDER BY fecha_programada ASC`,
      [id]
    );

    // Controles registrados
    const { rows: controles } = await query(
      `SELECT * FROM controles_nino_sano
       WHERE bebe_id = $1
       ORDER BY fecha_control ASC`,
      [id]
    );

    const planVacunas = generarPlanVacunas(fechaNacimiento, vacunas);
    const planControles = generarPlanControles(fechaNacimiento, controles);

    const mesesEdad = edadEnMeses(fechaNacimiento);
    const ultimoControl = controles[controles.length - 1] || null;
    let crecimiento = null;
    if (ultimoControl) {
      crecimiento = {
        ultimoControl: {
          fecha: formatFecha(ultimoControl.fecha_control),
          pesoKg: ultimoControl.peso_kg,
          tallaCm: ultimoControl.talla_cm,
          perimetroCefalicoCm: ultimoControl.perimetro_cefalico_cm,
          observaciones: ultimoControl.observaciones,
        },
        edadEnMeses: mesesEdad,
        clasificacion: clasificarPeso(mesesEdad, ultimoControl.peso_kg),
      };
    }

    // Conteos rápidos
    const totalVacunas = planVacunas.length;
    const vacunasAplicadas = planVacunas.filter((v) => v.cumplida).length;
    const vacunasPendientes = planVacunas.filter((v) => v.estado === "Pendiente").length;
    const vacunasAtrasadas = planVacunas.filter((v) => v.estado === "Atrasada").length;
    const totalControles = planControles.length;
    const controlesRealizados = planControles.filter((c) => c.realizado).length;

    return res.json({
      bebe: {
        id: bebe.id,
        nombre: bebe.nombre_bebe,
        fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
        edadActual: calcularEdad(bebe.fecha_nacimiento),
        edadEnMeses: mesesEdad,
      },
      meta: VACUNAS_META,
      planVacunas,
      planControles,
      crecimiento,
      resumen: {
        totalVacunas,
        vacunasAplicadas,
        vacunasPendientes,
        vacunasAtrasadas,
        totalControles,
        controlesRealizados,
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

/**
 * GET /api/bebes/:id/modulo-educativo
 * Devuelve los 3 módulos educativos consolidados en un solo payload
 * (útil para la vista detalle del bebé con tabs).
 */
export const obtenerModuloEducativoCompleto = async (req, res) => {
  try {
    const { id } = req.params;
    // Reutilizamos los handlers componiendo un objeto agregado.
    const fakeRes = {
      json: (data) => data,
      status: () => fakeRes,
    };
    // Llamadas internas vía query para no duplicar lógica.
    const { rows: bebeRows } = await query(
      "SELECT * FROM recien_nacidos WHERE id = $1",
      [id]
    );
    if (bebeRows.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }
    const bebe = bebeRows[0];
    const fechaNacimiento = new Date(bebe.fecha_nacimiento);

    // Triaje
    const { rows: evals } = await query(
      `SELECT * FROM evaluaciones_riesgo_bebe
       WHERE bebe_id = $1
       ORDER BY fecha_evaluacion DESC`,
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
        puntuacion: e.puntuacion_total,
        recomendacion: cls.recomendaciones,
        color: cls.color,
      };
    });

    // Seguimiento
    const { rows: dias } = await query(
      `SELECT * FROM seguimiento_diario_neonato
       WHERE bebe_id = $1
       ORDER BY evaluacion_riesgo_id, dia_seguimiento`,
      [id]
    );

    // Agrupar por evaluación de triaje (igual que en obtenerSeguimientoBebe)
    const gruposSeg = {};
    dias.forEach((d) => {
      const k = d.evaluacion_riesgo_id;
      if (!gruposSeg[k]) gruposSeg[k] = [];
      gruposSeg[k].push(d);
    });
    const triajesSeguimiento = Object.entries(gruposSeg).map(([triajeId, listaDias]) => {
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
    });

    const resumenGlobal = resumirSeguimiento(dias);

    // Vacunas y controles
    const { rows: vacunas } = await query(
      `SELECT * FROM vacunacion_neonato WHERE bebe_id = $1`,
      [id]
    );
    const { rows: controles } = await query(
      `SELECT * FROM controles_nino_sano WHERE bebe_id = $1`,
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
        fechaNacimiento: formatFecha(bebe.fecha_nacimiento),
        edadActual: calcularEdad(bebe.fecha_nacimiento),
        pesoAlNacer: bebe.peso_al_nacer,
        edadGestacional: bebe.edad_gestacional,
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
          vacunasPendientes: planVacunas.filter((v) => v.estado === "Pendiente").length,
          vacunasAtrasadas: planVacunas.filter((v) => v.estado === "Atrasada").length,
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
