import express, { json } from 'express' // require -> commonJS
import { exec } from "child_process";
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
import { DelateRouter } from './routes/deleteUsuarioRoute.js'
import { UpdateUsuarioRouter } from './routes/UpdateUsuarioRoute.js'
import { QuejaRouter } from './routes/queja.js'
import { EventoRouter } from './routes/evento.js'

// Imports para __dirname
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const crearApp = (Modelos) => {
  const app = express()
  app.use(json())
  
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
  app.use('/api/deleteUsuario', DelateRouter(Modelos))
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
  app.post("/ejecutarScript", (req, res) => {
    // Construye la ruta dinámicamente sin importar en qué computadora esté
    const scriptPath = path.join(__dirname, 'helpers', 'webScrapingPlaceID.py');
    
    // Usamos 'python3' que es el estándar en servidores Linux
    exec(`python3 "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el script: ${error.message}`);
        return res.status(500).send("Error al ejecutar el script");
      }
      if (stderr) {
        console.error(`Error en el script: ${stderr}`);
        return res.status(500).send("Error en el script");
      }
      console.log(`Resultado del script: ${stdout}`);
      res.send("Script ejecutado correctamente");
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