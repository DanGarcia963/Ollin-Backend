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
import {LugarVisitadoRouter} from './routes/museoVisitado.js'
import { DelateRouter } from './routes/deleteUsuarioRoute.js'
import { UpdateUsuarioRouter } from './routes/UpdateUsuarioRoute.js'
import { QuejaRouter } from './routes/queja.js'
import {EventoRouter} from './routes/evento.js'
// Imports para __dirname
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const crearApp = (Modelos) => {
  const app = express()
  app.use(json())
  app.use(cors())
  app.use(cookieParser())

  app.disable('x-powered-by')

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

  // Rutas del sitio web estático
  app.use(express.static(__dirname + '/public'))
  // Rutas para las páginas HTML
  app.use('/images', express.static('public/images'));
  // Pruebas de backend

  app.get('/config', (req, res) => {
    res.json({
      googleMapsApiKey: process.env.GMAPS_API_KEY
    });
  });

  app.get('/recuperarContrasena', soloPublico, (req, res) => res.sendFile(__dirname + '/pages/cambiar_contraseña.html'))
  app.get('/', soloPublico, (req, res) => res.sendFile(__dirname + '/pages/login_ES.html'))
  app.get('/registrar', soloPublico, (req, res) => res.sendFile(__dirname + '/pages/registro_turista_ES.html'))
  app.get('/recuperacion', soloPublico, (req, res) => res.sendFile(__dirname + '/pages/recuperacion_de_cuenta_ES.html'))
  app.get('/inicio', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/inicio.html'))
  app.get('/experience', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/Experience.html'))
  app.get('/museums', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/Museums.html'))
  app.get('/singleRoute', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/SingleRoute.html'))
  app.get('/MisFavoritos', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/MisFavoritos.html'))
  app.get('/MisVisitados', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/MisVisitados.html'))
  app.get('/cuenta_verificada', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/Cuenta_verificada.html'))
  app.get('/perfilTurista', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/perfilTurista.html'))
  app.get('/cuenta_creada', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/cuenta_creada.html'))
  app.get('/aventuras_proximas', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/Aventuras_proximas.html'))
  app.get('/aventuras_pasadas', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/aventuras_pasadas.html'))
  app.get('/despedida', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/despedida.html'))

  app.get('/LogInAdmin', soloPublico, (req, res) => res.sendFile(__dirname + '/pagesAdmin/login_Admin.html'))
  app.get('/registroAdmin', soloPublico, (req, res) => res.sendFile(__dirname + '/pagesAdmin/registro_Admin.html'))
  app.get('/inicioAdmin', soloPublico, (req, res) => res.sendFile(__dirname + '/pagesAdmin/inicioAdmin.html'))
  app.get('/museosAdmin', soloPublico, (req, res) => res.sendFile(__dirname + '/pagesAdmin/MuseumsAdmin.html'))
  app.get('/gestionUsers', soloPublico, (req, res) => res.sendFile(__dirname + '/pagesAdmin/gestionUsers.html'))
  app.get('/recuperarContrasenaAdmin', soloPublico, (req, res) => res.sendFile(__dirname + '/pagesAdmin/recuperacion_de_cuenta_Admin.html'))
  app.get('/recuperacionContrasenaAdmin', soloPublico, (req, res) => res.sendFile(__dirname + '/pagesAdmin/cambiar_contraseña_Admin.html'))
  app.get('/cuentaAdmin', soloPublico, (req, res) => res.sendFile(__dirname + '/pagesAdmin/perfilAdministrador.html'))

  app.get('/cuentas', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/cuentas.html'))
  app.get('/crear_usuario', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/crearUsuario.html'))
  app.get('/crear_empresa', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/crearEmpresa.html'))
  app.get('/actualizar', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/updateAdministrador.html'))
  app.get('/editar_aventura', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/editarAventura.html'))
  app.get('/EnCurso', soloAdmin, (req, res) => res.sendFile(__dirname + '/pages/AventuraEnCurso.html'))

  app.post("/ejecutarScript", (req, res) => {
    // Aquí puedes ejecutar tu script de Python
    exec("C:/Users/ae_es/AppData/Local/Python/pythoncore-3.14-64/python.exe c:/Users/ae_es/Ollin/helpers/webScrapingPlaceID.py", (error, stdout, stderr) => {
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
  
  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}