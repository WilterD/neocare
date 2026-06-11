/**
 * Transforma el estado del wizard de registro al body esperado por POST /api/registro
 */
export function mapRegistroPayload({
  datosPersonales,
  sociodemografica,
  condicionesCuidado,
  recienNacido,
  datosClinicos,
  consentimientoAceptado,
}) {
  return {
    consentimiento: consentimientoAceptado === true,
    madre: {
      nombreCompleto: datosPersonales.nombreCompleto.trim(),
      edad: datosPersonales.edad,
      telefono: datosPersonales.telefono,
      correo: datosPersonales.correo.trim(),
      password: datosPersonales.password,
      numeroIdentificacion: datosPersonales.numeroIdentificacion,
      nivelEducativo: sociodemografica.nivelEducativo,
      zonaResidencia: sociodemografica.zonaResidencia,
      accesoCentroSalud: sociodemografica.accesoCentroSalud,
      situacionEconomica: sociodemografica.situacionEconomica,
      relacionRecienNacido: condicionesCuidado.relacionRecienNacido,
      numeroNinosCuidado: condicionesCuidado.numeroNinosCuidado,
      cuidaSinApoyo: condicionesCuidado.cuidaSinApoyo,
      apoyoFamiliar: condicionesCuidado.apoyoFamiliar,
      apoyoPrincipal: condicionesCuidado.apoyoPrincipal,
      primeraVezCuidando: condicionesCuidado.primeraVezCuidando,
    },
    bebe: {
      nombreBebe: recienNacido.nombreBebe,
      fechaNacimiento: recienNacido.fechaNacimiento,
      sexo: recienNacido.sexo,
      pesoNacer: recienNacido.pesoNacer,
      edadGestacional: recienNacido.edadGestacional,
    },
    datosClinicos: {
      tipoParto: datosClinicos.tipoParto,
      complicacionesNacer: datosClinicos.complicacionesNacer,
      complicacion: datosClinicos.complicacion || "",
      hospitalizacionNeonatal: datosClinicos.hospitalizacionNeonatal,
      motivoHospitalizacion: datosClinicos.motivoHospitalizacion || "",
      duracionHospitalizacion: datosClinicos.duracionHospitalizacion || "",
      cuidadosEspeciales: datosClinicos.cuidadosEspeciales,
      tipoCuidadoRecibido: datosClinicos.tipoCuidadoRecibido || "",
    },
  };
}

/** Convierte el registro guardado en sesión al body de POST /api/evaluaciones */
export function mapEvaluacionFromRegistro(registro) {
  const dp = registro.datosPersonales || {};
  const sd = registro.sociodemografica || {};
  const cc = registro.condicionesCuidado || {};
  const rn = registro.recienNacido || {};
  const dc = registro.datosClinicos || {};

  return {
    madre: {
      nombreCompleto: dp.nombreCompleto,
      edad: dp.edad,
      telefono: dp.telefono,
      correo: dp.correo,
      numeroIdentificacion: dp.numeroIdentificacion,
      nivelEducativo: sd.nivelEducativo,
      zonaResidencia: sd.zonaResidencia,
      accesoCentroSalud: sd.accesoCentroSalud,
      situacionEconomica: sd.situacionEconomica,
      relacionRecienNacido: cc.relacionRecienNacido,
      numeroNinosCuidado: cc.numeroNinosCuidado,
      cuidaSinApoyo: cc.cuidaSinApoyo,
      apoyoFamiliar: cc.apoyoFamiliar,
      apoyoPrincipal: cc.apoyoPrincipal,
      primeraVezCuidando: cc.primeraVezCuidando,
    },
    bebe: {
      nombreBebe: rn.nombreBebe,
      fechaNacimiento: rn.fechaNacimiento,
      sexo: rn.sexo,
      pesoNacer: rn.pesoNacer,
      edadGestacional: rn.edadGestacional,
    },
    datosClinicos: {
      tipoParto: dc.tipoParto,
      complicacionesNacer: dc.complicacionesNacer,
      complicacion: dc.complicacion || "",
      hospitalizacionNeonatal: dc.hospitalizacionNeonatal,
      motivoHospitalizacion: dc.motivoHospitalizacion || "",
      duracionHospitalizacion: dc.duracionHospitalizacion || "",
      cuidadosEspeciales: dc.cuidadosEspeciales,
      tipoCuidadoRecibido: dc.tipoCuidadoRecibido || "",
    },
  };
}

/** Guarda sesión tras login o registro exitoso */
export function persistSession({ token, usuario, registro }) {
  localStorage.setItem("token", token);
  const userPayload = {
    ...usuario,
    nombre: usuario.nombre || usuario.nombreCompleto,
    nombreCompleto: usuario.nombreCompleto || usuario.nombre,
    datosPersonales: registro?.datosPersonales,
    sociodemografica: registro?.sociodemografica,
    condicionesCuidado: registro?.condicionesCuidado,
    recienNacido: registro?.recienNacido,
    datosClinicos: registro?.datosClinicos,
    resultadoRiesgo: registro?.resultadoRiesgo,
  };
  localStorage.setItem("neocareUser", JSON.stringify(userPayload));
  localStorage.setItem("neocareRegisterData", JSON.stringify(registro));
  if (registro?.resultadoRiesgo) {
    localStorage.setItem("neocareResultadoRiesgo", JSON.stringify(registro.resultadoRiesgo));
  }
  const bebeId = usuario?.bebe?.id || registro?.recienNacido?.id;
  if (bebeId) {
    localStorage.setItem("bebeActivoId", String(bebeId));
  }
}
