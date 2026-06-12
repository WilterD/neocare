const calcularEdadActual = (fechaNacimientoStr) => {
  if (!fechaNacimientoStr) return "";
  let partes;
  if (fechaNacimientoStr.includes("/")) {
    partes = fechaNacimientoStr.split("/"); // dd/mm/aaaa
  } else if (fechaNacimientoStr.includes("-")) {
    partes = fechaNacimientoStr.split("T")[0].split("-"); // yyyy-mm-dd
    if (partes[0].length === 4) {
      // Revertir para que coincida con dia, mes, anio
      partes = [partes[2], partes[1], partes[0]];
    }
  }
  if (!partes || partes.length !== 3) return "";
  
  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const anio = Number(partes[2]);
  
  if (!dia || !mes || !anio) return "";
  const fechaNacimiento = new Date(anio, mes - 1, dia);
  const fechaActual = new Date();
  
  fechaNacimiento.setHours(0, 0, 0, 0);
  fechaActual.setHours(0, 0, 0, 0);
  
  if (fechaNacimiento > fechaActual) {
    return "Fecha no válida";
  }
  
  let años = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
  let meses = fechaActual.getMonth() - fechaNacimiento.getMonth();
  let dias = fechaActual.getDate() - fechaNacimiento.getDate();
  
  if (dias < 0) {
    meses -= 1;
    const ultimoDiaMesAnterior = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      0
    ).getDate();
    dias += ultimoDiaMesAnterior;
  }
  
  if (meses < 0) {
    años -= 1;
    meses += 12;
  }
  
  if (años === 0 && meses === 0) {
    if (dias === 0) return "0 días";
    if (dias === 1) return "1 día";
    return `${dias} días`;
  }
  
  if (años === 0) {
    if (meses === 1 && dias === 0) return "1 mes";
    if (meses === 1) return `1 mes y ${dias} días`;
    if (dias === 0) return `${meses} meses`;
    return `${meses} meses y ${dias} días`;
  }
  
  if (meses === 0 && dias === 0) {
    return años === 1 ? "1 año" : `${años} años`;
  }
  
  if (meses === 0) {
    return años === 1
      ? `1 año y ${dias} días`
      : `${años} años y ${dias} días`;
  }
  
  if (dias === 0) {
    return años === 1
      ? `1 año y ${meses} meses`
      : `${años} años y ${meses} meses`;
  }
  
  return años === 1
    ? `1 año, ${meses} meses y ${dias} días`
    : `${años} años, ${meses} meses y ${dias} días`;
};

export const calcularRiesgoMaterno = (madre) => {
  let puntaje = 0;

  const edad = Number(madre.edad || madre.edadMadre || 0);
  if (edad > 0 && edad < 18) puntaje += 3;

  const nivelEducativo = madre.nivelEducativo || madre.nivelEducacion || madre.nivel_educacion || "";
  if (nivelEducativo === "Básica" || nivelEducativo === "Básico") puntaje += 1;

  const zonaResidencia = madre.zonaResidencia || madre.zona_residencia || "";
  if (zonaResidencia === "Rural") puntaje += 1;

  const accesoCentroSalud = madre.accesoCentroSalud;
  const sinAcceso = accesoCentroSalud === false || accesoCentroSalud === "No" || madre.acceso_centro_salud === false;
  if (sinAcceso) puntaje += 3;

  const madreSola = madre.madreSola || madre.es_madre_sola || madre.cuidaSinApoyo;
  const esSola = madreSola === true || madreSola === "Sí" || madreSola === 1;
  if (esSola) puntaje += 3;

  const apoyoFamiliar = madre.apoyoFamiliar || madre.tiene_apoyo_familiar;
  const sinApoyo = apoyoFamiliar === false || apoyoFamiliar === "No" || apoyoFamiliar === 0;
  if (sinApoyo) puntaje += 2;

  const numeroHijos = Number(madre.numeroHijos || madre.numero_hijos || madre.numeroNinosCuidado || 0);
  if (numeroHijos >= 2) puntaje += 2;

  const situacionEconomica = madre.situacionEconomica || madre.situacion_economica || "";
  if (situacionEconomica === "Baja") puntaje += 2;

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

export const calcularRiesgoNeonatal = (bebe, datosClinicos = {}) => {
  let puntaje = 0;

  const edadGestacional = Number(bebe.edadGestacional || bebe.edad_gestacional || 0);
  if (edadGestacional > 0 && edadGestacional < 37) puntaje += 3;

  const rawPeso = Number(bebe.pesoNacer || bebe.peso_al_nacer || 0);
  const pesoNacer = rawPeso > 10 ? rawPeso / 1000 : rawPeso; // Convertir a kg si viene en gramos
  if (pesoNacer > 0 && pesoNacer < 2.5) puntaje += 3;

  const complicacionesNacer = datosClinicos.complicacionesNacer || datosClinicos.complicaciones_al_nacer;
  const conComplicaciones = complicacionesNacer === true || complicacionesNacer === "Sí" || complicacionesNacer === 1;
  if (conComplicaciones) puntaje += 2;

  const hospitalizacionNeonatal = datosClinicos.hospitalizacionNeonatal || datosClinicos.hospitalizacion_neonatal;
  const conHospitalizacion = hospitalizacionNeonatal === true || hospitalizacionNeonatal === "Sí" || hospitalizacionNeonatal === 1;
  if (conHospitalizacion) puntaje += 2;

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

  const fechaNac = bebe.fechaNacimiento || bebe.fecha_nacimiento || "";
  const edadActual = calcularEdadActual(fechaNac);

  return {
    ...riesgoMaterno,
    ...riesgoNeonatal,
    ...riesgoCombinado,
    edadActual
  };
};