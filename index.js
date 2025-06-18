// Importa el framework Express para gestionar el servidor HTTP
import express from "express";

// Importa el middleware CORS para permitir peticiones desde otros orígenes
import cors from "cors";

// Importa la función que define y carga las rutas del backend (API REST)
import { loadBackendPRG } from "./src/back/cultural_events.js";

// Inicializa la aplicación Express
const app = express();

// Define el puerto donde se ejecutará el servidor (por entorno o valor por defecto)
const PORT = process.env.PORT || 16078;

// Middleware para interpretar cuerpos JSON en las solicitudes
app.use(express.json());

// Middleware para permitir peticiones CORS desde otros dominios
app.use(cors());

// (Opcional) Servir archivos estáticos si añades una carpeta pública:
// app.use(express.static("public"));

// Carga las rutas del backend para la API REST de eventos culturales
loadBackendPRG(app);

// Inicia el servidor Express
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
