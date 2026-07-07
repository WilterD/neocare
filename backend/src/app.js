import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensaje: "Backend de NeoCare funcionando correctamente" });
});

app.get("/api/health", (_req, res) => {
  const dbInfo = getDbInfo();
  res.json({ ok: true, db: dbInfo.type, dbPath: dbInfo.path || null });
});

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

export default app;
