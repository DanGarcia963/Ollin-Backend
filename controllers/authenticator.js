import dotenv from 'dotenv'
import { validarUsuarioTurista } from '../schema/usuarioTurista.js'
import { enviarEmailRecuperarContrasena, enviarEmailVerificacion } from '../services/mail.service.js'
import { generarTokenParaCorreo } from '../helpers/token.js'
import jsonwebtoken from 'jsonwebtoken'

dotenv.config()

export class AuthenticatorController {
  constructor (Modelos) {
    this.usuarioTuristaModel = Modelos.UsuarioTuristaModel
    this.authenticatorModel = Modelos.AuthenticatorModel
  }

registrarUsuarioTurista = async (req, res) => {
  const resultado = validarUsuarioTurista(req.body)
  
  if (!resultado.success) {
    return res.status(400).json({ error: JSON.parse(resultado.error.message) })
  }

  const nuevoUsuarioTurista = await this.authenticatorModel.registrarUsuarioTurista({ entrada: resultado.data })

  if (!nuevoUsuarioTurista || typeof nuevoUsuarioTurista === 'string') {
  return res.send({ status: 401, message: nuevoUsuarioTurista || 'Error al crear usuario' })
}

  // 🔍 DEBUG (muy útil)
  console.log("👤 Usuario creado:", nuevoUsuarioTurista)

  const tokenVerificacion = generarTokenParaCorreo(nuevoUsuarioTurista.Correo)

  const mail = await enviarEmailVerificacion(
    nuevoUsuarioTurista.Correo,
    nuevoUsuarioTurista.Nombre,
    tokenVerificacion
  )

  if (!mail || mail.response.statusText !== 'OK') {
    return res.send({ status: 500, message: 'Error enviando correo de verificación' })
  }

  res.send({
    status: 201,
    message: `Usuario ${nuevoUsuarioTurista.Nombre} agregado`,
    redirect: '/'
  })
}

  login = async (req, res) => {
    const usuarioLogueado = await this.authenticatorModel.login({ entrada: req.body })

    if (typeof usuarioLogueado === 'string') {
      return res.send({ status: 401, error: usuarioLogueado })
    }

    if (usuarioLogueado === false) return res.send({ status: 401, message: 'Usuario Incorrecto', redirect: '/' })

    const token = generarTokenParaCorreo(usuarioLogueado.Correo)

    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: '/'
    }

    await this.authenticatorModel.guardarUltimoLogin(usuarioLogueado.Correo)

    res.cookie('jwt', token, cookieOption)
    res.send({ status: 201, message: `Usuario ${usuarioLogueado.Nombre} logueado`, redirect: '/inicio' })
  }

  verificarCuenta = async (req, res) => {
    try {
      if (!req.params.token) return res.redirect('/')

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: '/' })

      const usuarioLogueado = await this.authenticatorModel.verificarCuenta(tokenDecodificado.Correo)

      const token = generarTokenParaCorreo(usuarioLogueado.Correo)

      const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: '/'
      }

      res.cookie('jwt', token, cookieOption)
      res.redirect('/')
    } catch (error) {
      res.send({ status: 500, redirect: '/' })
    }
  }

  olvidarContrasena = async (req, res) => {
    try {
      const usuarioTurista = await this.authenticatorModel.olvidarContrasena(req.body.Correo)

      const tokenOlvidarContrasena = generarTokenParaCorreo(usuarioTurista.Correo)

      const mail = await enviarEmailRecuperarContrasena(usuarioTurista.Correo, usuarioTurista.Nombre, tokenOlvidarContrasena)

      if (mail.response.statusText !== 'OK') {
        return res.send({ status: 500, message: 'Error enviando correo de recuperación de contraseña' })
      }

      if (typeof usuarioTurista === 'string') {
        return res.send({ status: 401, error: usuarioTurista })
      }

      res.send({ status: 201, message: `Se ha enviado un correo a ${usuarioTurista.Correo} para crear un nueva contraeña`, redirect: '/' })
    } catch (error) {
      res.send({ status: 500, redirect: '/', message: error })
    }
  }

  establecerCookieOlvidarContrasena = async (req, res) => {
    try {
      if (!req.params.token) return res.redirect('/')

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: '/' })

      const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: '/'
      }

      res.cookie('rct', req.params.token, cookieOption)
      res.redirect('/recuperarContrasena')
    } catch (error) {
      res.send({ status: 500, redirect: '/' })
    }
  }

  establecerNuevaContrasena = async (req, res) => {
    try {
      console.log(req.body)
      if (!req.body.Token) return res.redirect('/')

      const tokenDecodificado = jsonwebtoken.verify(req.body.Token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: '/' })

      const valores = {
        Correo: tokenDecodificado.Correo,
        Contrasena: req.body.Contrasena
      }

      await this.authenticatorModel.establecerNuevaContrasena({ entrada: valores })

      res.send({ status: 201, message: 'Se cambió correctamente la contraseña', redirect: '/' })
    } catch (error) {
      return res.send({ status: 401, message: 'Usuario Incorrecto', redirect: '/' })
    }
  }

  obtenerUsuarioLogueado = async (req, res) => {
    const { token } = req.body

    const decodificada = jsonwebtoken.verify(token, process.env.JWT_SECRET)

    const usuarioARevisar = await this.usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(decodificada.Correo)

    if (usuarioARevisar.length === 0) return false

    res.json(usuarioARevisar)
  }

  guardarUltimoLogin = async (req, res) => {
    const { Correo } = req.params
    try {
      await this.authenticatorModel.guardarUltimoLogin(Correo)
      res.send({ status: 200, message: 'Último login actualizado' })
    } catch (error) {
      res.send({ status: 500, message: 'Error al actualizar último login' })
    }
  }
}
