// Importa el framework Express para gestionar el servidor HTTP
import express from "express";

// Importa el middleware CORS para permitir peticiones desde otros orígenes
import cors from "cors";

// Importa la función que define y carga las rutas del backend (API REST)
import { loadBackendPRG } from "./src/back/cultural_events.js";

// Importa el handler del frontend (posiblemente generado por SvelteKit)
// import { handler } from "./src/front/build/handler.js";

// Inicializa la aplicación Express
const app = express();

// Define el puerto donde se ejecutará el servidor (por entorno o valor por defecto)
const PORT = process.env.PORT || 16078;

// Define la base para la versión de la API (aunque no se usa directamente aquí)
const BASE_API = "/api/v1";

// Middleware para interpretar cuerpos JSON en las solicitudes
app.use(express.json());

// Middleware para permitir peticiones CORS desde otros dominios
app.use(cors());

// Middleware comentado que serviría archivos estáticos desde el directorio raíz
// app.use("/", express.static(__dirname));

// Carga las rutas del backend para la API REST de eventos culturales
loadBackendPRG(app);

// Inicia el servidor Express en el puerto especificado
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Usa el handler del frontend como middleware para servir la SPA y manejar rutas no capturadas por Express
app.use(handler);
