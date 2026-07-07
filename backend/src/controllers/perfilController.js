import bcrypt from "bcryptjs";
import { query } from "../db.js";

export const obtenerPerfil = async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, nombre, edad, telefono, correo_electronico, numero_identificacion, relacion_bebe FROM madres_cuidadores WHERE id = $1",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Perfil no encontrado." });
    }
    const m = rows[0];
    return res.json({
      perfil: {
        id: m.id,
        nombreCompleto: m.nombre,
        edad: String(m.edad),
        telefono: m.telefono,
        correo: m.correo_electronico,
        numeroIdentificacion: m.numero_identificacion,
        relacion: m.relacion_bebe,
      },
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener perfil.", error: error.message });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { nombreCompleto, edad, telefono, correo, relacion } = req.body;
    const telefonoLimpio = String(telefono || "").replace(/\D/g, "");

    await query(
      `UPDATE madres_cuidadores SET
        nombre = COALESCE($1, nombre),
        edad = COALESCE($2, edad),
        telefono = COALESCE($3, telefono),
        correo_electronico = COALESCE($4, correo_electronico),
        relacion_bebe = COALESCE($5, relacion_bebe),
        actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [
        nombreCompleto || null,
        edad ? Number(edad) : null,
        telefonoLimpio || null,
        correo ? correo.trim().toLowerCase() : null,
        relacion || null,
        req.user.id,
      ]
    );

    const { rows } = await query(
      "SELECT id, nombre, edad, telefono, correo_electronico, relacion_bebe FROM madres_cuidadores WHERE id = $1",
      [req.user.id]
    );
    const m = rows[0];

    return res.json({
      mensaje: "Perfil actualizado correctamente.",
      perfil: {
        id: m.id,
        nombreCompleto: m.nombre,
        edad: String(m.edad),
        telefono: m.telefono,
        correo: m.correo_electronico,
        relacion: m.relacion_bebe,
      },
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al actualizar perfil.", error: error.message });
  }
};

export const cambiarContrasena = async (req, res) => {
  try {
    const { contrasenaActual, contrasenaNueva } = req.body;
    if (!contrasenaActual || !contrasenaNueva) {
      return res.status(400).json({ mensaje: "Contraseña actual y nueva son obligatorias." });
    }

    const { rows } = await query(
      "SELECT contrasena_hash FROM madres_cuidadores WHERE id = $1",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    const valida = await bcrypt.compare(contrasenaActual, rows[0].contrasena_hash);
    if (!valida) {
      return res.status(401).json({ mensaje: "Contraseña actual incorrecta." });
    }

    const hash = await bcrypt.hash(contrasenaNueva, 10);
    await query(
      "UPDATE madres_cuidadores SET contrasena_hash = $1, actualizado_en = CURRENT_TIMESTAMP WHERE id = $2",
      [hash, req.user.id]
    );

    return res.json({ mensaje: "Contraseña actualizada correctamente." });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al cambiar contraseña.", error: error.message });
  }
};
