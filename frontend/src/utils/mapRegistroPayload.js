export const mapRegistroPayload = ({
  datosPersonales,
  sociodemografica,
  condicionesCuidado,
  recienNacido,
  datosClinicos,
  consentimientoAceptado,
}) => {
  const { confirmPassword, ...personales } = datosPersonales || {};
  return {
    datosPersonales: {
      ...personales,
      correo: String(personales.correo || "").trim().toLowerCase(),
    },
    sociodemografica,
    condicionesCuidado,
    recienNacido,
    datosClinicos,
    consentimientoAceptado,
  };
};
