import { query } from "../db.js";

export const listarBitacoraBebe = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows: bebe } = await query(
      "SELECT id FROM recien_nacidos WHERE id = $1 AND madre_id = $2",
      [id, req.user.id]
    );
    if (bebe.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const { rows } = await query(
      `SELECT * FROM bitacora_cuidado_bebe WHERE bebe_id = $1 ORDER BY fecha_registro DESC`,
      [id]
    );

    const entradas = rows.map((r) => ({
      ...r,
      detalles: r.detalles ? JSON.parse(r.detalles) : null,
    }));

    return res.json({ total: entradas.length, entradas });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener bitácora del bebé.",
      error: error.message,
    });
  }
};

export const crearBitacoraBebe = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoRegistro, detalles, observaciones } = req.body;

    if (!tipoRegistro) {
      return res.status(400).json({ mensaje: "tipoRegistro es obligatorio." });
    }

    const { rows: bebe } = await query(
      "SELECT id FROM recien_nacidos WHERE id = $1 AND madre_id = $2",
      [id, req.user.id]
    );
    if (bebe.length === 0) {
      return res.status(404).json({ mensaje: "Bebé no encontrado." });
    }

    const sql = `
      INSERT INTO bitacora_cuidado_bebe (bebe_id, madre_id, tipo_registro, detalles, observaciones)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const { rows } = await query(sql, [
      id,
      req.user.id,
      tipoRegistro,
      JSON.stringify(detalles || { tipo: tipoRegistro }),
      observaciones || null,
    ]);

    return res.status(201).json({
      mensaje: "Registro de bitácora guardado.",
      id: rows[0]?.id,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al guardar bitácora del bebé.",
      error: error.message,
    });
  }
};

const parseFecha = (fechaStr) => {
  if (!fechaStr) return null;
  if (fechaStr.includes("/")) {
    const [dia, mes, anio] = fechaStr.split("/");
    return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }
  return fechaStr.split("T")[0];
};

const fechaNormalizadaEsFutura = (fechaIso) => {
  if (!fechaIso) return true;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [anio, mes, dia] = fechaIso.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha > hoy;
};

export const crearBebe = async (req, res) => {
  try {
    const {
      nombreBebe,
      fechaNacimiento,
      sexo,
      pesoNacer,
      edadGestacional,
      tipoParto,
      complicacionesNacer,
      complicacion,
      hospitalizacionNeonatal,
      motivoHospitalizacion,
      duracionHospitalizacion,
      cuidadosEspeciales,
      tipoCuidadoRecibido,
    } = req.body;

    if (!nombreBebe || !fechaNacimiento || !sexo || !pesoNacer || !edadGestacional) {
      return res.status(400).json({
        mensaje: "Nombre, fecha, sexo, peso y edad gestacional son obligatorios.",
      });
    }

    const fechaIso = parseFecha(fechaNacimiento);
    if (fechaNormalizadaEsFutura(fechaIso)) {
      return res.status(400).json({
        mensaje: "La fecha de nacimiento no puede ser futura.",
      });
    }

    const rawPeso = Number(pesoNacer);
    const pesoAlNacer = rawPeso > 10 ? rawPeso / 1000 : rawPeso;
    const complicaciones = complicacionesNacer === true || complicacionesNacer === "Sí";
    const hospitalizacion =
      hospitalizacionNeonatal === true || hospitalizacionNeonatal === "Sí";

    const sql = `
      INSERT INTO recien_nacidos (
        madre_id, nombre_bebe, fecha_nacimiento, peso_al_nacer, edad_gestacional, sexo,
        tipo_parto, complicaciones_al_nacer, especificacion_complicaciones, hospitalizacion_neonatal,
        motivo_hospitalizacion, duracion_hospitalizacion, requirio_cuidados_especiales, tipo_cuidado_recibido
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id
    `;

    const { rows } = await query(sql, [
      req.user.id,
      nombreBebe,
      fechaIso,
      pesoAlNacer,
      Number(edadGestacional),
      sexo,
      tipoParto || "Vaginal",
      complicaciones ? 1 : 0,
      complicaciones ? complicacion || "Complicación registrada" : null,
      hospitalizacion ? 1 : 0,
      hospitalizacion ? motivoHospitalizacion || null : null,
      hospitalizacion ? duracionHospitalizacion || null : null,
      cuidadosEspeciales || "No",
      cuidadosEspeciales === "Sí" ? tipoCuidadoRecibido || null : null,
    ]);

    return res.status(201).json({
      mensaje: "Bebé registrado correctamente.",
      bebe: { id: rows[0]?.id, nombre: nombreBebe },
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al registrar bebé.",
      error: error.message,
    });
  }
};
