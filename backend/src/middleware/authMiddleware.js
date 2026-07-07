import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ mensaje: "Token de autenticación requerido." });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "neocare_secret_key"
    );
    req.user = { id: payload.id, correo: payload.correo };
    return next();
  } catch {
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
};

export const authOptional = (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "neocare_secret_key"
      );
      req.user = { id: payload.id, correo: payload.correo };
    } catch {
      req.user = null;
    }
  }

  return next();
};
