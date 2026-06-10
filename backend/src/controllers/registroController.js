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

export const crearRegistro = async (req, res) => {
  try {
    const { madre, bebe, datosClinicos, consentimiento } = req.body;

    if (!madre || !bebe || !datosClinicos) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios del registro."
      });
    }

    if (consentimiento !== true) {
      return res.status(400).json({
        mensaje: "Debe aceptar el consentimiento informado para continuar."
      });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(madre.password, salt);

    // Mapeo de campos del frontend a columnas de la base de datos
    const nombreMadre = madre.nombreCompleto;
    const edadMadre = Number(madre.edad);
    const telefonoMadre = madre.telefono;
    const correoMadre = madre.correo;
    const numeroIdentificacion = madre.numeroIdentificacion;
    
    const nivelEducacion = madre.nivelEducativo;
    const zonaResidencia = madre.zonaResidencia;
    const accesoCentroSalud = madre.accesoCentroSalud === "Sí";
    const situacionEconomica = madre.situacionEconomica;

    const relacionBebe = madre.relacionRecienNacido;
    const numeroHijos = Number(madre.numeroNinosCuidado);
    const tieneDosOMasHijos = numeroHijos >= 2;
    const esMadreSola = madre.cuidaSinApoyo === "Sí";
    const tieneApoyoFamiliar = madre.apoyoFamiliar === "Sí";
    const apoyoPrincipal = madre.apoyoPrincipal;
    const esMadrePrimeriza = madre.primeraVezCuidando === "Sí";
    const aceptacionTerminos = consentimiento;

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
      const nombreBebe = bebe.nombreBebe;
      const fechaNacimiento = parseFecha(bebe.fechaNacimiento);
      const pesoAlNacer = Number(bebe.pesoNacer) / 1000; // Convertir gramos a kg
      const edadGestacional = Number(bebe.edadGestacional);
      const sexo = bebe.sexo;

      const tipoParto = datosClinicos.tipoParto;
      const complicacionesAlNacer = datosClinicos.complicacionesNacer === "Sí";
      const especificacionComplicaciones = complicacionesAlNacer ? datosClinicos.complicacion : null;
      const hospitalizacionNeonatal = datosClinicos.hospitalizacionNeonatal === "Sí";
      const motivoHospitalizacion = hospitalizacionNeonatal ? datosClinicos.motivoHospitalizacion : null;
      const duracionHospitalizacion = hospitalizacionNeonatal ? datosClinicos.duracionHospitalizacion : null;
      const requirioCuidadosEspeciales = datosClinicos.cuidadosEspeciales;
      const tipoCuidadoRecibido = datosClinicos.cuidadosEspeciales === "Sí" ? datosClinicos.tipoCuidadoRecibido : null;

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

      return { madreId, bebeId };
    });

    // Calcular riesgo de la evaluación
    const resultadoRiesgo = evaluarRegistro({ madre, bebe, datosClinicos });

    // Crear token JWT para inicio de sesión inmediato
    const token = jwt.sign(
      { id: result.madreId, correo: correoMadre },
      process.env.JWT_SECRET || "neocare_secret_key",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      mensaje: "Registro creado correctamente y guardado en la base de datos.",
      token,
      usuario: {
        id: result.madreId,
        nombre: nombreMadre,
        correo: correoMadre,
        bebe: {
          id: result.bebeId,
          nombre: bebe.nombreBebe
        }
      },
      registro: {
        datosPersonales: { ...madre, password: null, confirmPassword: null },
        sociodemografica,
        condicionesCuidado: { ...madre, numeroNinosCuidado: numeroHijos, primeraVezCuidando: madre.primeraVezCuidando },
        recienNacido: {
          ...bebe,
          pesoNacer: bebe.pesoNacer,
          edadActual: resultadoRiesgo.edadActual || "Calculado",
        },
        datosClinicos,
        resultadoRiesgo
      }
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
        fechaNacimiento: new Date(bebe.fecha_nacimiento).toLocaleDateString("es-ES"),
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