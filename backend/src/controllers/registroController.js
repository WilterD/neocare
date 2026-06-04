import { evaluarRegistro } from "../services/riesgoService.js";

const registros = [];

export const crearRegistro = (req, res) => {
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

    const resultadoRiesgo = evaluarRegistro({
      madre,
      bebe,
      datosClinicos
    });

    const nuevoRegistro = {
      id: registros.length + 1,
      madre,
      bebe,
      datosClinicos,
      consentimiento,
      resultadoRiesgo,
      fechaRegistro: new Date().toISOString()
    };

    registros.push(nuevoRegistro);

    return res.status(201).json({
      mensaje: "Registro creado correctamente.",
      registro: nuevoRegistro
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno al crear el registro.",
      error: error.message
    });
  }
};

export const obtenerRegistros = (req, res) => {
  return res.json({
    total: registros.length,
    registros
  });
};

export const obtenerRegistroPorId = (req, res) => {
  const { id } = req.params;

  const registro = registros.find((item) => item.id === Number(id));

  if (!registro) {
    return res.status(404).json({
      mensaje: "Registro no encontrado."
    });
  }

  return res.json(registro);
};