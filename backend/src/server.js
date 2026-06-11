import app from "./app.js";
import dotenv from "dotenv";
import { seedDatabase } from "./database/seed.js";
import { runMigrations } from "./database/migrate.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

runMigrations()
  .then(() => seedDatabase())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor NeoCare corriendo en http://localhost:${PORT}`);
      console.log(`Documentación API: http://localhost:${PORT}/api/docs`);
    });
  });
