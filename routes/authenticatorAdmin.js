import { Router } from 'express'
import { AuthenticatorAdminController } from '../controllers/authenticatorAdmin.js'

export const AuthenticatorAdminRouter = (Modelos) => {
  const AuthenticatorAdminRouter = Router()
  const authenticatorAdminController = new AuthenticatorAdminController(Modelos)

  AuthenticatorAdminRouter.post('/loginAdmin', authenticatorAdminController.loginAdmin)
  AuthenticatorAdminRouter.post('/registroA/usuarioAdmin', authenticatorAdminController.registrarUsuarioAdmin)

  AuthenticatorAdminRouter.get('/verificarCuenta/:token', authenticatorAdminController.verificarCuenta)
  AuthenticatorAdminRouter.post('/usuarioadminLogueado', authenticatorAdminController.obtenerUsuarioAdminLogueado)

  AuthenticatorAdminRouter.get('/recuperarContrasena/:token', authenticatorAdminController.establecerCookieOlvidarContrasena)
  AuthenticatorAdminRouter.post('/olvidarContrasena', authenticatorAdminController.olvidarContrasena)
  AuthenticatorAdminRouter.post('/establecerNuevaContrasena', authenticatorAdminController.establecerNuevaContrasena)

  return AuthenticatorAdminRouter
}