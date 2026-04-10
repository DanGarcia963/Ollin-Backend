import dotenv from 'dotenv'
import { validarUsuarioTurista } from '../schema/usuarioTurista.js'
import { enviarEmailRecuperarContrasena, enviarEmailVerificacion } from '../services/mail.service.js'
import { generarTokenParaCorreo } from '../helpers/token.js'
import jsonwebtoken from 'jsonwebtoken'

dotenv.config()

// La URL de tu Netlify (Asegúrate de ponerla en las variables de Railway)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://127.0.0.1:5500'

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
      redirect: '/cuenta_creada.html' // Modificado para que vaya a tu archivo exacto
    })
  }

  login = async (req, res) => {
    const usuarioLogueado = await this.authenticatorModel.login({ entrada: req.body })

    if (typeof usuarioLogueado === 'string') {
      return res.send({ status: 401, error: usuarioLogueado })
    }

    // Modificado: Si falla, lo devolvemos a tu archivo de login exacto
    if (usuarioLogueado === false) return res.send({ status: 401, message: 'Usuario Incorrecto', redirect: `${FRONTEND_URL}/login_ES.html` })

    const token = generarTokenParaCorreo(usuarioLogueado.Correo)

    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: `${FRONTEND_URL}/login_ES.html`, // Modificado para que la cookie solo se envíe en las rutas de tu frontend
      sameSite: 'none', // Vital para Railway -> Netlify
      secure: true      // Vital para Railway -> Netlify
    }

    await this.authenticatorModel.guardarUltimoLogin(usuarioLogueado.Correo)

    res.cookie('jwt', token, cookieOption)
    
    // Modificado: Si el login es exitoso, lo mandamos a tu archivo inicio.html
    res.send({ status: 201, message: `Usuario ${usuarioLogueado.Nombre} logueado`, redirect: `${FRONTEND_URL}/inicio.html` })
  }

  verificarCuenta = async (req, res) => {
    try {
      // Modificado: Si hay error en un link de correo, lo mandamos a tu login
      if (!req.params.token) return res.redirect(`${FRONTEND_URL}/login_ES.html`)

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: `${FRONTEND_URL}/login_ES.html` })

      const usuarioLogueado = await this.authenticatorModel.verificarCuenta(tokenDecodificado.Correo)

      const token = generarTokenParaCorreo(usuarioLogueado.Correo)

      const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: `${FRONTEND_URL}/login_ES.html`, // Modificado para que la cookie solo se envíe en las rutas de tu frontend
        sameSite: 'none',
        secure: true
      }

      res.cookie('jwt', token, cookieOption)
      // Modificado: Redirección dura tras éxito a la pantalla de cuenta verificada
      res.redirect(`${FRONTEND_URL}/Cuenta_verificada.html`)
    } catch (error) {
      res.redirect(`${FRONTEND_URL}/login_ES.html`)
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

      // Modificado: Lo devolvemos al login tras enviar el correo
      res.send({ status: 201, message: `Se ha enviado un correo a ${usuarioTurista.Correo} para crear un nueva contraeña`, redirect: `${FRONTEND_URL}/login_ES.html` })
    } catch (error) {
      res.send({ status: 500, redirect: `${FRONTEND_URL}/login_ES.html`, message: error })
    }
  }

  establecerCookieOlvidarContrasena = async (req, res) => {
    try {
      if (!req.params.token) return res.redirect(`${FRONTEND_URL}/login_ES.html`)

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.redirect(`${FRONTEND_URL}/login_ES.html`)

      const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: `${FRONTEND_URL}/login_ES.html`,
        sameSite: 'none',
        secure: true
      }

      res.cookie('rct', req.params.token, cookieOption)
      // Modificado: Redirección dura a tu archivo de cambiar contraseña (ojo con la 'ñ' en el nombre del archivo, Netlify a veces se queja de eso, te sugiero cambiarlo a 'cambiar_contrasena.html' en tu repo)
      res.redirect(`${FRONTEND_URL}/cambiar_contraseña.html`)
    } catch (error) {
      res.redirect(`${FRONTEND_URL}/login_ES.html`)
    }
  }

  establecerNuevaContrasena = async (req, res) => {
    try {
      console.log(req.body)
      if (!req.body.Token) return res.send({ status: 400, message: 'Falta Token', redirect: `${FRONTEND_URL}/login_ES.html` })

      const tokenDecodificado = jsonwebtoken.verify(req.body.Token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: `${FRONTEND_URL}/login_ES.html` })

      const valores = {
        Correo: tokenDecodificado.Correo,
        Contrasena: req.body.Contrasena
      }

      await this.authenticatorModel.establecerNuevaContrasena({ entrada: valores })

      res.send({ status: 201, message: 'Se cambió correctamente la contraseña', redirect: `${FRONTEND_URL}/login_ES.html` })
    } catch (error) {
      return res.send({ status: 401, message: 'Usuario Incorrecto', redirect: `${FRONTEND_URL}/login_ES.html` })
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