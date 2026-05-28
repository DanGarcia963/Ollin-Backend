import { Router } from 'express'
import { UsuarioTuristaController } from '../controllers/usuarioTurista.js'

export const UsuarioTuristaRouter = (Modelos) => {
  const UsuarioTuristaRouter = Router()
  const usuarioTuristaController = new UsuarioTuristaController(Modelos)

  UsuarioTuristaRouter.get('/', usuarioTuristaController.obtenerTodosLosUsuarios)
  UsuarioTuristaRouter.post('/validarCuenta', usuarioTuristaController.validarCuenta)
  UsuarioTuristaRouter.get('/identificador/:id', usuarioTuristaController.obtenerUsuarioTuristaPorId)
  UsuarioTuristaRouter.get('/:Correo', usuarioTuristaController.obtenerUsuarioTuristaPorCorreo)

  UsuarioTuristaRouter.post('/cambiarContrasena', usuarioTuristaController.cambiarContraseña)
  UsuarioTuristaRouter.post('/actualizarNom', usuarioTuristaController.actualizarNombre)
  UsuarioTuristaRouter.post('/actualizarApe', usuarioTuristaController.actualizarApellido)
  UsuarioTuristaRouter.post('/actualizarEmail', usuarioTuristaController.actualizarCorreo)
  
  return UsuarioTuristaRouter
}