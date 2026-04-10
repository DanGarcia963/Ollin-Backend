import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import { UsuarioTuristaModel } from '../models/MySQL/usuarioTurista.js'
import { UsuarioAdminModel } from '../models/MySQL/usuarioAdmin.js'

dotenv.config()

export const soloAdmin = async (req, res, next) => {
  const logueado = await validarCookie(req)
  if (logueado) return next()

  return res.redirect('/')
}

export const soloPublico = async (req, res, next) => {
  const logueado = await validarCookie(req)

  if (!logueado) return next()

  return res.redirect('/inicio')
}

export const soloAdministrador = async (req, res, next) => {
  const logueado = await validarCookieAdmin(req)
  if (logueado) return next()
  return res.redirect('/LogInAdmin')
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