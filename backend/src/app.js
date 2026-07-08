import "dotenv/config";
import express from "express";
import cors from "cors";

import registroRoutes from "./routes/registroRoutes.js";
import bebesRoutes from "./routes/bebesRoutes.js";
import clinicoRoutes from "./routes/clinicoRoutes.js";
import evaluacionesRoutes from "./routes/evaluacionesRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import contactoRoutes from "./routes/contactoRoutes.js";
import educacionRoutes from "./routes/educacionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import testimoniosRoutes from "./routes/testimoniosRoutes.js";
import emocionalRoutes from "./routes/emocionalRoutes.js";
import notificacionesRoutes from "./routes/notificacionesRoutes.js";

import { getDbInfo } from "./db.js";

const app = express();

// Permite el frontend de Vite aunque cambie de puerto: 5173, 5174, 5175, etc.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isLocalDevelopment =
        !origin ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:");

      if (isLocalDevelopment || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("Origen bloqueado por CORS:", origin);
      return callback(new Error("No permitido por CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    mensaje: "Backend de NeoCare funcionando correctamente",
  });
});

app.get("/api/health", (_req, res) => {
  const dbInfo = getDbInfo();

  res.json({
    ok: true,
    db: dbInfo.type,
    dbPath: dbInfo.path || null,
    port: process.env.PORT || 4000,
    frontendUrl: process.env.FRONTEND_URL || null,
    allowedOrigins,
  });
});

// Rutas principales
app.use("/api", registroRoutes);
app.use("/api", authRoutes);
app.use("/api", clinicoRoutes);
app.use("/api", bebesRoutes);
app.use("/api", evaluacionesRoutes);
app.use("/api", perfilRoutes);
app.use("/api", contactoRoutes);
app.use("/api", educacionRoutes);
app.use("/api", testimoniosRoutes);
app.use("/api", emocionalRoutes);
app.use("/api", notificacionesRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada.",
    metodo: req.method,
    ruta: req.originalUrl,
  });
});

// Manejador global de errores
app.use((err, req, res, _next) => {
  console.error("Error global del backend:", err);

  res.status(err.status || 500).json({
    mensaje: err.message || "Error interno del servidor.",
    ruta: req.originalUrl,
    metodo: req.method,
  });
});

export default app;