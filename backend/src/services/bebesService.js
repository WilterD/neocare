import { query } from "../db.js";
import { seedVacunasParaBebe } from "./vacunasService.js";

const parseFecha = (fechaStr) => {
  if (!fechaStr) return null;
  const partes = fechaStr.split("/");
  if (partes.length !== 3) return fechaStr;
  const [dia, mes, anio] = partes;
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

export const listarBebes = async (madreId) => {
  const res = await query("SELECT * FROM recien_nacidos WHERE madre_id = $1 ORDER BY id", [madreId]);
  return res.rows;
};

export const obtenerBebe = async (madreId, bebeId) => {
  const res = await query("SELECT * FROM recien_nacidos WHERE id = $1 AND madre_id = $2", [bebeId, madreId]);
  return res.rows[0] || null;
};

export const crearBebe = async (madreId, { bebe, datosClinicos }) => {
  const fechaNacimiento = parseFecha(bebe.fechaNacimiento);
  const pesoAlNacer = Number(bebe.pesoNacer) / 1000;

  const res = await query(
    `INSERT INTO recien_nacidos (
      madre_id, nombre_bebe, fecha_nacimiento, peso_al_nacer, edad_gestacional, sexo,
      tipo_parto, complicaciones_al_nacer, especificacion_complicaciones, hospitalizacion_neonatal,
      motivo_hospitalizacion, duracion_hospitalizacion, requirio_cuidados_especiales, tipo_cuidado_recibido
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
    [
      madreId, bebe.nombreBebe, fechaNacimiento, pesoAlNacer, Number(bebe.edadGestacional), bebe.sexo,
      datosClinicos.tipoParto,
      datosClinicos.complicacionesNacer === "Sí" ? 1 : 0,
      datosClinicos.complicacion || null,
      datosClinicos.hospitalizacionNeonatal === "Sí" ? 1 : 0,
      datosClinicos.motivoHospitalizacion || null,
      datosClinicos.duracionHospitalizacion || null,
      datosClinicos.cuidadosEspeciales,
      datosClinicos.tipoCuidadoRecibido || null,
    ]
  );

  const bebeId = res.rows[0]?.id;
  await seedVacunasParaBebe(bebeId, fechaNacimiento);
  return bebeId;
};

export const actualizarBebe = async (madreId, bebeId, { bebe, datosClinicos }) => {
  const fechaNacimiento = bebe?.fechaNacimiento ? parseFecha(bebe.fechaNacimiento) : undefined;
  const pesoAlNacer = bebe?.pesoNacer ? Number(bebe.pesoNacer) / 1000 : undefined;

  await query(
    `UPDATE recien_nacidos SET
      nombre_bebe = COALESCE($1, nombre_bebe),
      fecha_nacimiento = COALESCE($2, fecha_nacimiento),
      peso_al_nacer = COALESCE($3, peso_al_nacer),
      edad_gestacional = COALESCE($4, edad_gestacional),
      sexo = COALESCE($5, sexo),
      tipo_parto = COALESCE($6, tipo_parto),
      complicaciones_al_nacer = COALESCE($7, complicaciones_al_nacer),
      especificacion_complicaciones = COALESCE($8, especificacion_complicaciones),
      hospitalizacion_neonatal = COALESCE($9, hospitalizacion_neonatal)
     WHERE id = $10 AND madre_id = $11`,
    [
      bebe?.nombreBebe, fechaNacimiento, pesoAlNacer,
      bebe?.edadGestacional ? Number(bebe.edadGestacional) : null,
      bebe?.sexo, datosClinicos?.tipoParto,
      datosClinicos?.complicacionesNacer === "Sí" ? 1 : datosClinicos?.complicacionesNacer === "No" ? 0 : null,
      datosClinicos?.complicacion, datosClinicos?.hospitalizacionNeonatal === "Sí" ? 1 : datosClinicos?.hospitalizacionNeonatal === "No" ? 0 : null,
      bebeId, madreId,
    ]
  );
};
