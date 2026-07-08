import "dotenv/config";
import app from "./app.js";
import { getDbInfo } from "./db.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, "127.0.0.1", () => {
  const dbInfo = getDbInfo();

  console.log("======================================");
  console.log(`Servidor NeoCare corriendo en http://127.0.0.1:${PORT}`);
  console.log(`Servicio de Base de Datos: ${dbInfo.type}`);
  console.log("======================================");
});