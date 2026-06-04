export const calcularRiesgoMaterno = (madre) => {
  let puntaje = 0;

  if (madre.edad < 18) puntaje += 3;
  if (madre.nivelEducativo === "Básica") puntaje += 1;
  if (madre.zonaResidencia === "Rural") puntaje += 1;
  if (madre.accesoCentroSalud === false) puntaje += 3;
  if (madre.madreSola === true) puntaje += 3;
  if (madre.apoyoFamiliar === false) puntaje += 2;
  if (madre.numeroHijos >= 2) puntaje += 2;
  if (madre.situacionEconomica === "Baja") puntaje += 2;

  let clasificacion = "Bajo";
  let codigo = "RM_LOW";

  if (puntaje >= 4 && puntaje <= 6) {
    clasificacion = "Medio";
    codigo = "RM_MED";
  }

  if (puntaje >= 7) {
    clasificacion = "Alto";
    codigo = "RM_HIGH";
  }

  return {
    puntajeMaterno: puntaje,
    clasificacionMaterna: clasificacion,
    codigoMaterno: codigo
  };
};

export const calcularRiesgoNeonatal = (bebe, datosClinicos) => {
  let puntaje = 0;

  if (bebe.edadGestacional < 37) puntaje += 3;
  if (bebe.pesoNacer < 2.5) puntaje += 3;
  if (datosClinicos.complicacionesNacer === true) puntaje += 2;
  if (datosClinicos.hospitalizacionNeonatal === true) puntaje += 2;

  let clasificacion = "Bajo";
  let codigo = "RN_LOW";

  if (puntaje >= 3 && puntaje <= 5) {
    clasificacion = "Medio";
    codigo = "RN_MED";
  }

  if (puntaje >= 6) {
    clasificacion = "Alto";
    codigo = "RN_HIGH";
  }

  return {
    puntajeNeonatal: puntaje,
    clasificacionNeonatal: clasificacion,
    codigoNeonatal: codigo
  };
};

export const calcularRiesgoCombinado = (
  clasificacionMaterna,
  clasificacionNeonatal
) => {
  let clasificacionFinal = "Bajo";
  let recomendacionSeguimiento = "Seguimiento básico";

  if (clasificacionMaterna === "Bajo" && clasificacionNeonatal === "Bajo") {
    clasificacionFinal = "Bajo";
    recomendacionSeguimiento =
      "Mantener cuidados básicos, observación diaria y controles pediátricos habituales.";
  } else if (
    clasificacionMaterna === "Alto" &&
    clasificacionNeonatal === "Alto"
  ) {
    clasificacionFinal = "Alto";
    recomendacionSeguimiento =
      "Prioridad máxima. Se recomienda buscar valoración médica lo antes posible.";
  } else if (
    clasificacionMaterna === "Alto" &&
    clasificacionNeonatal === "Bajo"
  ) {
    clasificacionFinal = "Medio";
    recomendacionSeguimiento =
      "Seguimiento reforzado. Se recomienda mayor acompañamiento y vigilancia del entorno de cuidado.";
  } else {
    clasificacionFinal = "Medio";
    recomendacionSeguimiento =
      "Seguimiento clínico. Se recomienda vigilancia cercana y consulta médica ante cualquier signo de alarma.";
  }

  return {
    clasificacionFinal,
    recomendacionSeguimiento
  };
};

export const evaluarRegistro = ({ madre, bebe, datosClinicos }) => {
  const riesgoMaterno = calcularRiesgoMaterno(madre);
  const riesgoNeonatal = calcularRiesgoNeonatal(bebe, datosClinicos);

  const riesgoCombinado = calcularRiesgoCombinado(
    riesgoMaterno.clasificacionMaterna,
    riesgoNeonatal.clasificacionNeonatal
  );

  return {
    ...riesgoMaterno,
    ...riesgoNeonatal,
    ...riesgoCombinado
  };
};