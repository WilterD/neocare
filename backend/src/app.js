import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import registroRoutes from "./routes/registroRoutes.js";
import bebesRoutes from "./routes/bebesRoutes.js";

dotenv.config();

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
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend de NeoCare funcionando correctamente",
  });
});

app.use("/api", registroRoutes);
app.use("/api", bebesRoutes);

export default app;