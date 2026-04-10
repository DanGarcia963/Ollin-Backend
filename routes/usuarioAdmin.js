import { Router } from 'express'
import { UsuarioAdminController } from '../controllers/usuarioAdmin.js'

export const UsuarioAdminRouter = (Modelos) => {
  const UsuarioAdminRouter = Router()
  const usuarioAdminController = new UsuarioAdminController(Modelos)

  UsuarioAdminRouter.get('/', usuarioAdminController.obtenerTodosLosAdmins)
  UsuarioAdminRouter.get('/:Correo', usuarioAdminController.obtenerUsuarioAdminPorCorreo)
  UsuarioAdminRouter.get('/identificador/:id', usuarioAdminController.obtenerUsuarioAdminPorId)
  UsuarioAdminRouter.post('/cambiarContrasena', usuarioAdminController.cambiarContraseña)
  UsuarioAdminRouter.post('/actualizarNom', usuarioAdminController.actualizarNombre)
  UsuarioAdminRouter.post('/actualizarApe', usuarioAdminController.actualizarApellido)
  UsuarioAdminRouter.post('/actualizarEmail', usuarioAdminController.actualizarCorreo)
  UsuarioAdminRouter.delete('/eliminar/:id', usuarioAdminController.borrarPorEmail)
  return UsuarioAdminRouter
}