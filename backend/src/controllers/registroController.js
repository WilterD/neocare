import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query, transaction } from "../db.js";
import { evaluarRegistro } from "../services/riesgoService.js";
import {
  buildRegistroFromPayload,
  formatRegistroFromDb,
} from "../utils/formatRegistro.js";
import { guardarEvaluacion } from "../services/evaluacionService.js";
import { seedVacunasParaBebe } from "../services/vacunasService.js";

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
    const correoMadre = madre.correo.trim().toLowerCase();
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

    const resultadoRiesgo = evaluarRegistro({ madre, bebe, datosClinicos });

    const fechaNac = parseFecha(bebe.fechaNacimiento);
    await seedVacunasParaBebe(result.bebeId, fechaNac);

    const evaluacionGuardada = await guardarEvaluacion(
      result.madreId,
      result.bebeId,
      resultadoRiesgo
    );

    // Crear token JWT para inicio de sesión inmediato
    const token = jwt.sign(
      { id: result.madreId, correo: correoMadre },
      process.env.JWT_SECRET || "neocare_secret_key",
      { expiresIn: "7d" }
    );

    const registro = buildRegistroFromPayload(madre, bebe, datosClinicos, resultadoRiesgo);
    registro.recienNacido = { ...registro.recienNacido, id: result.bebeId };

    return res.status(201).json({
      mensaje: "Registro creado correctamente y guardado en la base de datos.",
      token,
      evaluacionId: evaluacionGuardada.id,
      usuario: {
        id: result.madreId,
        nombre: nombreMadre,
        nombreCompleto: nombreMadre,
        correo: correoMadre,
        bebe: {
          id: result.bebeId,
          nombre: bebe.nombreBebe,
        },
      },
      registro,
    });
  } catch (error) {
    console.error("Error al registrar:", error);

    if (
      error.code === "23505" ||
      error.code === "SQLITE_CONSTRAINT_UNIQUE" ||
      error.code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        mensaje: "Este correo electrónico ya está registrado.",
      });
    }

    return res.status(500).json({
      mensaje: "Error interno al crear el registro en la base de datos.",
      error: error.message,
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

    const payload = formatRegistroFromDb(madre, bebe.id ? bebe : null);

    const evalRes = await query(
      `SELECT * FROM evaluaciones_riesgo_registro
       WHERE madre_id = $1 ORDER BY fecha_evaluacion DESC LIMIT 1`,
      [madre.id]
    );
    if (evalRes.rows[0]) {
      const e = evalRes.rows[0];
      payload.resultadoRiesgo = {
        puntajeMaterno: e.puntaje_materno,
        clasificacionMaterna: e.clasificacion_materna,
        puntajeNeonatal: e.puntaje_neonatal,
        clasificacionNeonatal: e.clasificacion_neonatal,
        clasificacionFinal: e.clasificacion_final,
        recomendacionSeguimiento: e.recomendacion_seguimiento,
      };
      payload.evaluacionId = e.id;
    }

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
        nombreCompleto: madre.nombre,
        correo: madre.correo_electronico,
        ...(bebe.id
          ? { bebe: { id: bebe.id, nombre: bebe.nombre_bebe } }
          : {}),
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

export const obtenerRegistroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (Number(req.user.id) !== Number(id)) {
      return res.status(403).json({ mensaje: "No autorizado." });
    }
    const resMadre = await query("SELECT * FROM madres_cuidadores WHERE id = $1", [id]);
    
    if (resMadre.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Registro no encontrado."
      });
    }

    const madre = resMadre.rows[0];
    const resBebe = await query("SELECT * FROM recien_nacidos WHERE madre_id = $1", [id]);

    const bebe = resBebe.rows[0] || null;
    return res.json({
      madre,
      bebe,
      registro: formatRegistroFromDb(madre, bebe),
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener registro por ID.",
      error: error.message
    });
  }
};