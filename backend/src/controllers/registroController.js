import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query, transaction } from "../db.js";
import { evaluarRegistro } from "../services/riesgoService.js";

// Helper para parsear fecha de dd/mm/aaaa a yyyy-mm-dd
const parseFecha = (fechaStr) => {
  if (!fechaStr) return null;
  const partes = fechaStr.split("/");
  if (partes.length !== 3) return fechaStr; // Ya en formato correcto
  const [dia, mes, anio] = partes;
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

// Helper para formatear fecha de yyyy-mm-dd o Date a dd/mm/aaaa
const formatFechaEs = (fecha) => {
  if (!fecha) return "";
  let fechaStr = "";
  if (fecha instanceof Date) {
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  } else {
    fechaStr = String(fecha);
  }
  if (fechaStr.includes("-")) {
    const partes = fechaStr.split("T")[0].split("-");
    if (partes.length === 3) {
      const [anio, mes, dia] = partes;
      return `${dia}/${mes}/${anio}`;
    }
  }
  return fechaStr;
};

export const crearRegistro = async (req, res) => {
  try {
    const { 
      madre, 
      bebe, 
      datosClinicos, 
      consentimiento,
      datosPersonales,
      sociodemografica,
      condicionesCuidado,
      recienNacido,
      consentimientoAceptado
    } = req.body;

    // Normalizar datos de la madre/cuidador
    const datosM = datosPersonales || madre;
    const socioM = sociodemografica || madre;
    const cuidadoM = condicionesCuidado || madre;
    
    // Normalizar recien nacido y consentimiento
    const recienN = recienNacido || bebe;
    const aceptacionTerminos = consentimientoAceptado !== undefined ? consentimientoAceptado : consentimiento;

    if (!datosM || !recienN || !datosClinicos) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios del registro."
      });
    }

    if (aceptacionTerminos !== true) {
      return res.status(400).json({
        mensaje: "Debe aceptar el consentimiento informado para continuar."
      });
    }

    const password = datosM.password || datosM.contrasena;
    if (!password) {
      return res.status(400).json({
        mensaje: "La contraseña es obligatoria."
      });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(password, salt);

    // Mapeo de campos a columnas de la base de datos
    const nombreMadre = datosM.nombreCompleto || datosM.nombre;
    const edadMadre = Number(datosM.edad);
    const telefonoMadre = String(datosM.telefono || "").replace(/\D/g, ""); // Sanitizar teléfono (eliminar no dígitos)
    const correoMadre = datosM.correo || datosM.correo_electronico || datosM.correoElectronico;
    const numeroIdentificacion = datosM.numeroIdentificacion || datosM.numero_identificacion;
    
    const nivelEducacion = socioM.nivelEducativo || socioM.nivel_educacion;
    const zonaResidencia = socioM.zonaResidencia || socioM.zona_residencia;
    const accesoCentroSalud = socioM.accesoCentroSalud === "Sí" || socioM.acceso_centro_salud === true || socioM.accesoCentroSalud === true;
    const situacionEconomica = socioM.situacionEconomica || socioM.situacion_economica;

    const relacionBebe = cuidadoM.relacionRecienNacido || cuidadoM.relacion_bebe || cuidadoM.relacionBebe;
    const numeroHijos = Number(cuidadoM.numeroNinosCuidado || cuidadoM.numero_hijos || cuidadoM.numeroHijos || 0);
    const tieneDosOMasHijos = numeroHijos >= 2;
    const esMadreSola = cuidadoM.cuidaSinApoyo === "Sí" || cuidadoM.es_madre_sola === true || cuidadoM.esMadreSola === true;
    const tieneApoyoFamiliar = cuidadoM.apoyoFamiliar === "Sí" || cuidadoM.tiene_apoyo_familiar === true || cuidadoM.tieneApoyoFamiliar === true;
    const apoyoPrincipal = cuidadoM.apoyoPrincipal;
    const esMadrePrimeriza = cuidadoM.primeraVezCuidando === "Sí" || cuidadoM.es_madre_primeriza === true || cuidadoM.esMadrePrimeriza === true;

    // Ejecutar transacción para insertar madre y recién nacido
    const result = await transaction(async (executeQuery) => {
      // 1. Insertar madre
      const sqlMadre = `
        INSERT INTO madres_cuidadores (
          nombre, edad, telefono, correo_electronico, contrasena_hash, numero_identificacion,
          nivel_educacion, zona_residencia, acceso_centro_salud, situacion_economica,
          relacion_bebe, numero_hijos, tiene_dos_o_mas_hijos, es_madre_sola,
          tiene_apoyo_familiar, apoyo_principal, es_madre_primeriza, aceptacion_terminos
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id;
      `;
      
      const resMadre = await executeQuery(sqlMadre, [
        nombreMadre, edadMadre, telefonoMadre, correoMadre, contrasenaHash, numeroIdentificacion,
        nivelEducacion, zonaResidencia, accesoCentroSalud, situacionEconomica,
        relacionBebe, numeroHijos, tieneDosOMasHijos, esMadreSola,
        tieneApoyoFamiliar, apoyoPrincipal, esMadrePrimeriza, aceptacionTerminos
      ]);

      const madreId = resMadre.rows[0].id || resMadre.rows[0].insertId; // postgres o mysql

      // 2. Insertar recién nacido
      const nombreBebe = recienN.nombreBebe || recienN.nombre_bebe;
      const fechaNacimiento = parseFecha(recienN.fechaNacimiento || recienN.fecha_nacimiento);
      const rawPeso = Number(recienN.pesoNacer || recienN.peso_al_nacer || 0);
      const pesoAlNacer = rawPeso > 10 ? rawPeso / 1000 : rawPeso; // Convertir gramos a kg si es necesario
      const edadGestacional = Number(recienN.edadGestacional || recienN.edad_gestacional);
      const sexo = recienN.sexo;

      const tipoParto = datosClinicos.tipoParto || datosClinicos.tipo_parto;
      const complicacionesAlNacer = datosClinicos.complicacionesNacer === "Sí" || datosClinicos.complicaciones_al_nacer === true || datosClinicos.complicacionesAlNacer === true;
      const especificacionComplicaciones = complicacionesAlNacer ? (datosClinicos.complicacion || datosClinicos.especificacion_complicaciones) : null;
      const hospitalizacionNeonatal = datosClinicos.hospitalizacionNeonatal === "Sí" || datosClinicos.hospitalizacion_neonatal === true || datosClinicos.hospitalizacionNeonatal === true;
      const motivoHospitalizacion = hospitalizacionNeonatal ? (datosClinicos.motivoHospitalizacion || datosClinicos.motivo_hospitalizacion) : null;
      const duracionHospitalizacion = hospitalizacionNeonatal ? (datosClinicos.duracionHospitalizacion || datosClinicos.duracion_hospitalizacion) : null;
      const requirioCuidadosEspeciales = datosClinicos.cuidadosEspeciales || datosClinicos.requirio_cuidados_especiales || "No";
      const tipoCuidadoRecibido = (requirioCuidadosEspeciales === "Sí" || requirioCuidadosEspeciales === true) ? (datosClinicos.tipoCuidadoRecibido || datosClinicos.tipo_cuidado_recibido) : null;

      const sqlBebe = `
        INSERT INTO recien_nacidos (
          madre_id, nombre_bebe, fecha_nacimiento, peso_al_nacer, edad_gestacional, sexo,
          tipo_parto, complicaciones_al_nacer, especificacion_complicaciones, hospitalizacion_neonatal,
          motivo_hospitalizacion, duracion_hospitalizacion, requirio_cuidados_especiales, tipo_cuidado_recibido
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id;
      `;

      const resBebe = await executeQuery(sqlBebe, [
        madreId, nombreBebe, fechaNacimiento, pesoAlNacer, edadGestacional, sexo,
        tipoParto, complicacionesAlNacer, especificacionComplicaciones, hospitalizacionNeonatal,
        motivoHospitalizacion, duracionHospitalizacion, requirioCuidadosEspeciales, tipoCuidadoRecibido
      ]);

      const bebeId = resBebe.rows[0].id || resBebe.rows[0].insertId;

      return { 
        madreId, 
        bebeId, 
        pesoAlNacer, 
        fechaNacimiento, 
        nombreBebe, 
        sexo, 
        edadGestacional, 
        tipoParto, 
        complicacionesAlNacer, 
        especificacionComplicaciones, 
        hospitalizacionNeonatal, 
        motivoHospitalizacion, 
        duracionHospitalizacion, 
        requirioCuidadosEspeciales, 
        tipoCuidadoRecibido 
      };
    });

    // Calcular riesgo de la evaluación con datos normalizados
    const resultadoRiesgo = evaluarRegistro({
      madre: {
        edad: edadMadre,
        nivelEducativo: nivelEducacion,
        zonaResidencia: zonaResidencia,
        accesoCentroSalud: accesoCentroSalud,
        madreSola: esMadreSola,
        apoyoFamiliar: tieneApoyoFamiliar,
        numeroHijos: numeroHijos,
        situacionEconomica: situacionEconomica
      },
      bebe: {
        edadGestacional: edadGestacional,
        pesoNacer: result.pesoAlNacer
      },
      datosClinicos: {
        complicacionesNacer: result.complicacionesAlNacer,
        hospitalizacionNeonatal: result.hospitalizacionNeonatal
      }
    });

    // Crear token JWT para inicio de sesión inmediato
    const token = jwt.sign(
      { id: result.madreId, correo: correoMadre },
      process.env.JWT_SECRET || "neocare_secret_key",
      { expiresIn: "7d" }
    );

    const responsePayload = {
      datosPersonales: {
        nombreCompleto: nombreMadre,
        edad: String(edadMadre),
        numeroIdentificacion: numeroIdentificacion,
        telefono: telefonoMadre,
        correo: correoMadre
      },
      sociodemografica: {
        nivelEducativo: nivelEducacion,
        zonaResidencia: zonaResidencia,
        accesoCentroSalud: accesoCentroSalud ? "Sí" : "No",
        situacionEconomica: situacionEconomica
      },
      condicionesCuidado: {
        relacionRecienNacido: relacionBebe,
        primeraVezCuidando: esMadrePrimeriza ? "Sí" : "No",
        cuidaSinApoyo: esMadreSola ? "Sí" : "No",
        numeroNinosCuidado: String(numeroHijos),
        apoyoFamiliar: tieneApoyoFamiliar ? "Sí" : "No",
        apoyoPrincipal: apoyoPrincipal
      },
      recienNacido: {
        nombreBebe: result.nombreBebe,
        fechaNacimiento: formatFechaEs(result.fechaNacimiento),
        sexo: result.sexo,
        pesoNacer: String(Math.round(result.pesoAlNacer * 1000)), // kg a gramos
        edadGestacional: String(result.edadGestacional),
        edadActual: resultadoRiesgo.edadActual || "Calculado"
      },
      datosClinicos: {
        tipoParto: result.tipoParto,
        complicacionesNacer: result.complicacionesAlNacer ? "Sí" : "No",
        complicacion: result.especificacionComplicaciones || "",
        hospitalizacionNeonatal: result.hospitalizacionNeonatal ? "Sí" : "No",
        motivoHospitalizacion: result.motivoHospitalizacion || "",
        duracionHospitalizacion: result.duracionHospitalizacion || "",
        cuidadosEspeciales: result.requirioCuidadosEspeciales || "No",
        tipoCuidadoRecibido: result.tipoCuidadoRecibido || ""
      },
      resultadoRiesgo
    };

    return res.status(201).json({
      mensaje: "Registro creado correctamente y guardado en la base de datos.",
      token,
      usuario: {
        id: result.madreId,
        nombre: nombreMadre,
        correo: correoMadre,
        bebe: {
          id: result.bebeId,
          nombre: result.nombreBebe
        }
      },
      registro: responsePayload
    });

  } catch (error) {
    console.error("Error al registrar:", error);
    return res.status(500).json({
      mensaje: "Error interno al crear el registro en la base de datos.",
      error: error.message
    });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Por favor, ingresa correo y contraseña."
      });
    }

    // Buscar madre en la base de datos
    const sqlMadre = "SELECT * FROM madres_cuidadores WHERE correo_electronico = $1";
    const resMadre = await query(sqlMadre, [email.trim().toLowerCase()]);

    if (resMadre.rows.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontró un usuario registrado con este correo."
      });
    }

    const madre = resMadre.rows[0];

    // Verificar contraseña
    const esPasswordValida = await bcrypt.compare(password, madre.contrasena_hash);
    if (!esPasswordValida) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta."
      });
    }

    // Buscar bebés asociados
    const sqlBebe = "SELECT * FROM recien_nacidos WHERE madre_id = $1";
    const resBebe = await query(sqlBebe, [madre.id]);
    const bebe = resBebe.rows[0] || {};

    // Formatear datos de vuelta para el frontend
    const payload = {
      datosPersonales: {
        nombreCompleto: madre.nombre,
        edad: String(madre.edad),
        numeroIdentificacion: madre.numero_identificacion,
        telefono: madre.telefono,
        correo: madre.correo_electronico
      },
      sociodemografica: {
        nivelEducativo: madre.nivel_educacion,
        zonaResidencia: madre.zona_residencia,
        accesoCentroSalud: madre.acceso_centro_salud ? "Sí" : "No",
        situacionEconomica: madre.situacion_economica
      },
      condicionesCuidado: {
        relacionRecienNacido: madre.relacion_bebe,
        primeraVezCuidando: madre.es_madre_primeriza ? "Sí" : "No",
        cuidaSinApoyo: madre.es_madre_sola ? "Sí" : "No",
        numeroNinosCuidado: String(madre.numero_hijos),
        apoyoFamiliar: madre.tiene_apoyo_familiar ? "Sí" : "No",
        apoyoPrincipal: madre.apoyo_principal
      },
      recienNacido: bebe.id ? {
        nombreBebe: bebe.nombre_bebe,
        fechaNacimiento: formatFechaEs(bebe.fecha_nacimiento),
        sexo: bebe.sexo,
        pesoNacer: String(Math.round(Number(bebe.peso_al_nacer) * 1000)), // De kg a gramos
        edadGestacional: String(bebe.edad_gestacional)
      } : {},
      datosClinicos: bebe.id ? {
        tipoParto: bebe.tipo_parto,
        complicacionesNacer: bebe.complicaciones_al_nacer ? "Sí" : "No",
        complicacion: bebe.especificacion_complicaciones || "",
        hospitalizacionNeonatal: bebe.hospitalizacion_neonatal ? "Sí" : "No",
        motivoHospitalizacion: bebe.motivo_hospitalizacion || "",
        duracionHospitalizacion: bebe.duracion_hospitalizacion || "",
        cuidadosEspeciales: bebe.requirio_cuidados_especiales || "No",
        tipoCuidadoRecibido: bebe.tipo_cuidado_recibido || ""
      } : {}
    };

    // Crear token
    const token = jwt.sign(
      { id: madre.id, correo: madre.correo_electronico },
      process.env.JWT_SECRET || "neocare_secret_key",
      { expiresIn: "7d" }
    );

    return res.json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id: madre.id,
        nombre: madre.nombre,
        correo: madre.correo_electronico
      },
      registro: payload
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({
      mensaje: "Error interno al iniciar sesión.",
      error: error.message
    });
  }
};

export const obtenerRegistros = async (req, res) => {
  try {
    const resMadres = await query("SELECT * FROM madres_cuidadores");
    return res.json({
      total: resMadres.rows.length,
      registros: resMadres.rows
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener registros de la base de datos.",
      error: error.message
    });
  }
};

export const obtenerRegistroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const resMadre = await query("SELECT * FROM madres_cuidadores WHERE id = $1", [id]);
    
    if (resMadre.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Registro no encontrado."
      });
    }

    const madre = resMadre.rows[0];
    const resBebe = await query("SELECT * FROM recien_nacidos WHERE madre_id = $1", [id]);

    return res.json({
      madre,
      bebe: resBebe.rows[0] || null
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener registro por ID.",
      error: error.message
    });
  }
};