import { Router } from 'express'
import { AuthenticatorController } from '../controllers/authenticator.js'

export const AuthenticatorRouter = (Modelos) => {
  const AuthenticatorRouter = Router()
  const authenticatorController = new AuthenticatorController(Modelos)

  AuthenticatorRouter.post('/login', authenticatorController.login)
  AuthenticatorRouter.post('/registro/usuarioTurista', authenticatorController.registrarUsuarioTurista)

  AuthenticatorRouter.get('/verificarCuenta/:token', authenticatorController.verificarCuenta)
  AuthenticatorRouter.post('/usuarioLogueado', authenticatorController.obtenerUsuarioLogueado)

  AuthenticatorRouter.get('/recuperarContrasena/:token', authenticatorController.establecerCookieOlvidarContrasena)
  AuthenticatorRouter.post('/olvidarContrasena', authenticatorController.olvidarContrasena)
  AuthenticatorRouter.post('/establecerNuevaContrasena', authenticatorController.establecerNuevaContrasena)

  AuthenticatorRouter.get('/LastLogin/:Correo', authenticatorController.guardarUltimoLogin)

  return AuthenticatorRouter
}
