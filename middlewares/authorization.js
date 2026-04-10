import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import { UsuarioTuristaModel } from '../models/MySQL/usuarioTurista.js'
import { UsuarioAdminModel } from '../models/MySQL/usuarioAdmin.js'

dotenv.config()
// La URL de tu Netlify (Asegúrate de ponerla en las variables de Railway)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://127.0.0.1:5500'

export const soloAdmin = async (req, res, next) => {
  const logueado = await validarCookie(req)
  if (logueado) return next()

  return res.redirect(`${FRONTEND_URL}/login_ES.html`)
}

export const soloPublico = async (req, res, next) => {
  const logueado = await validarCookie(req)

  if (!logueado) return next()

  return res.redirect(`${FRONTEND_URL}/inicio.html`)
}

export const soloAdministrador = async (req, res, next) => {
  const logueado = await validarCookieAdmin(req)
  if (logueado) return next()
  return res.redirect(`${FRONTEND_URL}/LogInAdmin.html`)
}

const validarCookie = async (req) => {
  try {
    const cookieJWT = req.headers.cookie
      ?.split('; ')
      .find(cookie => cookie.startsWith('jwt='))
      ?.slice(4)

    if (!cookieJWT) return false

    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET)

    const usuarioARevisar = await UsuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(decodificada.Correo)

    if (usuarioARevisar.length === 0) return false

    return true
  } catch (error) {
    return false
  }
}

const validarCookieAdmin = async (req) => {
  try {
    const cookieJWT = req.headers.cookie
      ?.split('; ')
      .find(cookie => cookie.startsWith('jwt_admin='))
      ?.slice(10)

    if (!cookieJWT) return false

    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET)

    const admin = await UsuarioAdminModel.obtenerUsuarioAdminPorCorreo(decodificada.Correo)

    if (admin.length === 0) return false

    return true
  } catch (error) {
    return false
  }
}