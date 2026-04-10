import { Router } from 'express'
import { UsuarioTuristaController } from '../controllers/usuarioTurista.js'

export const UsuarioTuristaRouter = (Modelos) => {
  const UsuarioTuristaRouter = Router()
  const usuarioTuristaController = new UsuarioTuristaController(Modelos)

  UsuarioTuristaRouter.get('/', usuarioTuristaController.obtenerTodosLosUsuarios)
  UsuarioTuristaRouter.get('/:Correo', usuarioTuristaController.obtenerUsuarioTuristaPorCorreo)
  UsuarioTuristaRouter.get('/identificador/:id', usuarioTuristaController.obtenerUsuarioTuristaPorId)
  UsuarioTuristaRouter.post('/cambiarContrasena', usuarioTuristaController.cambiarContraseña)
  UsuarioTuristaRouter.post('/actualizarNom', usuarioTuristaController.actualizarNombre)
  UsuarioTuristaRouter.post('/actualizarApe', usuarioTuristaController.actualizarApellido)
  UsuarioTuristaRouter.post('/actualizarEmail', usuarioTuristaController.actualizarCorreo)
  
  return UsuarioTuristaRouter
}
