import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { configurePassport } from "./auth/passport.js";
import { setupSwagger } from "./config/swagger.js";
import registroRoutes from "./routes/registroRoutes.js";
import educacionRoutes from "./routes/educacionRoutes.js";
import evaluacionesRoutes from "./routes/evaluacionesRoutes.js";
import contactoRoutes from "./routes/contactoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import bebesRoutes from "./routes/bebesRoutes.js";
import clinicoRoutes from "./routes/clinicoRoutes.js";
import emocionalRoutes from "./routes/emocionalRoutes.js";
import notificacionesRoutes from "./routes/notificacionesRoutes.js";

dotenv.config();
configurePassport();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ mensaje: "Backend de NeoCare funcionando correctamente" });
});

setupSwagger(app);

app.use("/api", registroRoutes);
app.use("/api", authRoutes);
app.use("/api", educacionRoutes);
app.use("/api", evaluacionesRoutes);
app.use("/api", contactoRoutes);
app.use("/api", perfilRoutes);
app.use("/api", bebesRoutes);
app.use("/api", clinicoRoutes);
app.use("/api", emocionalRoutes);
app.use("/api", notificacionesRoutes);

export default app;
