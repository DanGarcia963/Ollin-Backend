import express, { json } from 'express' // require -> commonJS
import { exec, spawn } from "child_process"; // Añade spawn aquí
import cors from "cors";
import 'dotenv/config'

import { corsMiddleware } from './middlewares/cors.js'
import { soloAdmin, soloPublico, soloAdministrador } from './middlewares/authorization.js'
import cookieParser from 'cookie-parser'
import { AuthenticatorRouter } from './routes/authenticator.js'
import { AuthenticatorAdminRouter } from './routes/authenticatorAdmin.js'
import { UsuarioTuristaRouter } from './routes/usuarioTurista.js'
import { UsuarioAdminRouter } from './routes/usuarioAdmin.js'
import { LugarRouter } from './routes/museo.js'
import { LugarFavoritoRouter } from './routes/museoFavorito.js'
import { ItinerarioRouter } from './routes/plan.js'
import { LugarItinerarioRouter } from './routes/museoPlan.js'
import { LugarVisitadoRouter } from './routes/museoVisitado.js'
import { DeleteRouter } from './routes/deleteUsuarioRoute.js'
import { UpdateUsuarioRouter } from './routes/UpdateUsuarioRoute.js'
import { QuejaRouter } from './routes/queja.js'
import { EventoRouter } from './routes/evento.js'

// Imports para __dirname
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const crearApp = (Modelos) => {
  const app = express()

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // 1. ESCUDO CORS (Permite a Netlify comunicarse y enviar las cookies de sesión)
  app.use(cors({
    origin: [
      'http://localhost:5500', // Para pruebas locales con Live Server
      'http://127.0.0.1:5500',
      'https://ollin-tt.netlify.app' // ¡RECUERDA CAMBIAR ESTO POR TU URL DE NETLIFY!
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }))

  app.use(cookieParser())
  app.disable('x-powered-by')

  // ==========================================
  // RUTAS DE LA API (El Cerebro)
  // ==========================================
  app.use('/api/authenticator', AuthenticatorRouter(Modelos))
  app.use('/api/authenticatorAdmin', AuthenticatorAdminRouter(Modelos))
  app.use('/api/usuarioTurista', UsuarioTuristaRouter(Modelos))
  app.use('/api/usuarioAdmin', UsuarioAdminRouter(Modelos))
  app.use('/api/lugar', LugarRouter(Modelos))
  app.use('/api/lugarFavorito', LugarFavoritoRouter(Modelos))
  app.use('/api/itinerario', ItinerarioRouter(Modelos))
  app.use('/api/lugarItinerario', LugarItinerarioRouter(Modelos))
  app.use('/api/lugarVisitado', LugarVisitadoRouter(Modelos))
  app.use('/api/queja', QuejaRouter(Modelos))
  app.use('/api/evento', EventoRouter(Modelos))
  app.use('/api/deleteUsuario', DeleteRouter(Modelos))
  app.use('/api/updateUsuario', UpdateUsuarioRouter(Modelos))

  // Endpoint para que el Frontend obtenga la API Key de Maps
  app.get('/config', (req, res) => {
    res.json({
      googleMapsApiKey: process.env.GMAPS_API_KEY
    });
  });

// ==========================================
  // SCRIPT DE PYTHON (Adaptado para la nube Linux)
  // ==========================================

// ==========================================
  // VARIABLES PARA GUARDAR LOS LOGS EN VIVO
  // ==========================================
  let logScrapingMuseos = "Presiona 'Actualizar' para iniciar el scraping...";
  let logScrapingEventos = "Presiona 'Crear' para buscar eventos...";

  // Endpoint para que el frontend lea los logs de Museos
  app.get("/logs/museos", (req, res) => {
    res.send(logScrapingMuseos);
  });

  // Endpoint para que el frontend lea los logs de Eventos
  app.get("/logs/eventos", (req, res) => {
    res.send(logScrapingEventos);
  });

  // ==========================================
  // SCRIPTS DE PYTHON (Ejecución en Streaming)
  // ==========================================
  
  app.post("/ejecutarScript", (req, res) => {
    // 1. Respondemos rápido para no bloquear el frontend
    res.send("Iniciado");
    
    // 2. Limpiamos el log anterior
    logScrapingMuseos = "Iniciando actualización de museos...\n";

    const scriptPath = path.join(__dirname, 'helpers', 'webScrapingPlaceID.py');
    
    // 3. Usamos spawn para leer datos en vivo
    const pythonProcess = spawn('python3', [scriptPath]);

    pythonProcess.stdout.on('data', (data) => {
      logScrapingMuseos += data.toString();
      // Recortamos el texto para no saturar la memoria de Railway si imprime demasiado
      if(logScrapingMuseos.length > 10000) logScrapingMuseos = logScrapingMuseos.slice(-10000);
    });

    pythonProcess.stderr.on('data', (data) => {
      logScrapingMuseos += `\n[ADVERTENCIA]: ${data.toString()}`;
    });

    pythonProcess.on('close', (code) => {
      logScrapingMuseos += `\n✅ Proceso finalizado con código ${code}`;
    });
  });

  app.post("/ejecutarScriptNightMuseums", (req, res) => {
    res.send("Iniciado");
    logScrapingEventos = "Buscando eventos de Noche de Museos...\n";

    const scriptPath = path.join(__dirname, 'helpers', 'NightMuseums.py');
    const pythonProcess = spawn('python3', [scriptPath]);

    pythonProcess.stdout.on('data', (data) => {
      logScrapingEventos += data.toString();
      if(logScrapingEventos.length > 10000) logScrapingEventos = logScrapingEventos.slice(-10000);
    });

    pythonProcess.stderr.on('data', (data) => {
      logScrapingEventos += `\n[ADVERTENCIA]: ${data.toString()}`;
    });

    pythonProcess.on('close', (code) => {
      logScrapingEventos += `\n✅ Proceso finalizado con código ${code}`;
    });
  });
  
  // ==========================================
  // INICIO DEL SERVIDOR
  // ==========================================
  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`API de Ollin escuchando en el puerto ${PORT}`)
  })
}