/** Construye el objeto registro que consume el frontend a partir de filas de BD */
export const formatRegistroFromDb = (madre, bebe = null) => ({
  datosPersonales: {
    nombreCompleto: madre.nombre,
    edad: String(madre.edad),
    numeroIdentificacion: madre.numero_identificacion,
    telefono: madre.telefono,
    correo: madre.correo_electronico,
  },
  sociodemografica: {
    nivelEducativo: madre.nivel_educacion,
    zonaResidencia: madre.zona_residencia,
    accesoCentroSalud: madre.acceso_centro_salud ? "Sí" : "No",
    situacionEconomica: madre.situacion_economica,
  },
  condicionesCuidado: {
    relacionRecienNacido: madre.relacion_bebe,
    primeraVezCuidando: madre.es_madre_primeriza ? "Sí" : "No",
    cuidaSinApoyo: madre.es_madre_sola ? "Sí" : "No",
    numeroNinosCuidado: String(madre.numero_hijos),
    apoyoFamiliar: madre.tiene_apoyo_familiar ? "Sí" : "No",
    apoyoPrincipal: madre.apoyo_principal,
  },
  recienNacido: bebe?.id
    ? {
        nombreBebe: bebe.nombre_bebe,
        fechaNacimiento: new Date(bebe.fecha_nacimiento).toLocaleDateString("es-ES"),
        sexo: bebe.sexo,
        pesoNacer: String(Math.round(Number(bebe.peso_al_nacer) * 1000)),
        edadGestacional: String(bebe.edad_gestacional),
      }
    : {},
  datosClinicos: bebe?.id
    ? {
        tipoParto: bebe.tipo_parto,
        complicacionesNacer: bebe.complicaciones_al_nacer ? "Sí" : "No",
        complicacion: bebe.especificacion_complicaciones || "",
        hospitalizacionNeonatal: bebe.hospitalizacion_neonatal ? "Sí" : "No",
        motivoHospitalizacion: bebe.motivo_hospitalizacion || "",
        duracionHospitalizacion: bebe.duracion_hospitalizacion || "",
        cuidadosEspeciales: bebe.requirio_cuidados_especiales || "No",
        tipoCuidadoRecibido: bebe.tipo_cuidado_recibido || "",
      }
    : {},
});

export const buildRegistroFromPayload = (madre, bebe, datosClinicos, resultadoRiesgo = null) => ({
  datosPersonales: {
    nombreCompleto: madre.nombreCompleto,
    edad: String(madre.edad),
    numeroIdentificacion: madre.numeroIdentificacion,
    telefono: madre.telefono,
    correo: madre.correo,
  },
  sociodemografica: {
    nivelEducativo: madre.nivelEducativo,
    zonaResidencia: madre.zonaResidencia,
    accesoCentroSalud: madre.accesoCentroSalud,
    situacionEconomica: madre.situacionEconomica,
  },
  condicionesCuidado: {
    relacionRecienNacido: madre.relacionRecienNacido,
    primeraVezCuidando: madre.primeraVezCuidando,
    cuidaSinApoyo: madre.cuidaSinApoyo,
    numeroNinosCuidado: String(madre.numeroNinosCuidado),
    apoyoFamiliar: madre.apoyoFamiliar,
    apoyoPrincipal: madre.apoyoPrincipal,
  },
  recienNacido: {
    nombreBebe: bebe.nombreBebe,
    fechaNacimiento: bebe.fechaNacimiento,
    sexo: bebe.sexo,
    pesoNacer: String(bebe.pesoNacer),
    edadGestacional: String(bebe.edadGestacional),
  },
  datosClinicos,
  ...(resultadoRiesgo ? { resultadoRiesgo } : {}),
});
