import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token de autenticación requerido." });
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "neocare_secret_key");
    req.user = { id: decoded.id, correo: decoded.correo };
    next();
  } catch {
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
};
