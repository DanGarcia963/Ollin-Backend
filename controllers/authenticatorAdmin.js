import dotenv from 'dotenv'
import { validarUsuarioAdmin} from '../schema/usuarioAdmin.js'
import { enviarEmailRecuperarContrasenaAdmin, enviarEmailVerificacionAdmin } from '../services/mail.service.js'
import { generarTokenParaCorreo } from '../helpers/token.js'
import jsonwebtoken from 'jsonwebtoken'

dotenv.config()

export class AuthenticatorAdminController {
  constructor (Modelos) {
    this.usuarioAdminModel = Modelos.UsuarioAdminModel
    this.authenticatorAdminModel = Modelos.AuthenticatorAdminModel
  }

  registrarUsuarioAdmin = async (req, res) => {
    const resultado = validarUsuarioAdmin(req.body)
    if (!resultado.success) {
      return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }

    const nuevoUsuarioAdmin = await this.authenticatorAdminModel.registrarUsuarioAdmin({ entrada: resultado.data })

    if(!nuevoUsuarioAdmin || typeof nuevoUsuarioAdmin ==='string'){
      return res.send({status:401, message: nuevoUsuarioAdmin ||'Error al crear administrador'})
    }
    console.log("Usuario creado:", nuevoUsuarioAdmin)

    const tokenVerificacion = generarTokenParaCorreo(nuevoUsuarioAdmin.Correo)

    const mail= await enviarEmailVerificacionAdmin(
      nuevoUsuarioAdmin.Correo,
      nuevoUsuarioAdmin.Nombre,
      tokenVerificacion
    )

    if(!mail || mail.response.statusText !== 'OK'){
      return res.send({status: 500, message: 'Error enviando correo de verificacion a Administrador'})
    }

    res.send({ status: 201, 
      message: `Usuario ${nuevoUsuarioAdmin.Nombre} agregado`, 
      redirect: '/LogInAdmin' })
  }

  loginAdmin = async (req, res) => {
    const usuarioLogueado = await this.authenticatorAdminModel.loginAdmin({ entrada: req.body })
    console.log("Datos que voy a enviar:"+ req.body)
    if (typeof usuarioLogueado === 'string') {
      return res.send({ status: 401, error: usuarioLogueado })
    }

    if (usuarioLogueado === false) return res.send({ status: 401, message: 'Usuario Incorrecto', redirect: '/LogInAdmin' })

    const token = generarTokenParaCorreo(usuarioLogueado.Correo)

    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: '/LogInAdmin'
    }

    res.cookie('jwt_admin', token, cookieOption)
    res.send({ status: 201, message: `Usuario ${usuarioLogueado.Nombre} logueado`, redirect: '/inicioAdmin' })
  }

  verificarCuenta = async (req, res) => {
    try {
      if (!req.params.token) return res.redirect('/LogInAdmin')

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: '/LogInAdmin' })

      const usuarioLogueado = await this.authenticatorAdminModel.verificarCuenta(tokenDecodificado.Correo)

      const token = generarTokenParaCorreo(usuarioLogueado.Correo)

      const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: '/LogInAdmin'
      }

      res.cookie('jwt', token, cookieOption)
      res.redirect('/LogInAdmin')
    } catch (error) {
      res.send({ status: 500, redirect: '/LogInAdmin' })
    }
  }

  olvidarContrasena = async (req, res) => {
    try {
      const usuarioAdmin = await this.authenticatorAdminModel.olvidarContrasena(req.body.Correo)

      const tokenOlvidarContrasena = generarTokenParaCorreo(usuarioAdmin.Correo)

      const mail = await enviarEmailRecuperarContrasenaAdmin(usuarioAdmin.Correo, usuarioAdmin.Nombre, tokenOlvidarContrasena)

      if (mail.response.statusText !== 'OK') {
        return res.send({ status: 500, message: 'Error enviando correo de recuperación de contraseña' })
      }

      if (typeof usuarioAdmin === 'string') {
        return res.send({ status: 401, error: usuarioAdmin })
      }

      res.send({ status: 201, message: `Se ha enviado un correo a ${usuarioAdmin.Correo} para crear un nueva contraseña`, redirect: '/LogInAdmin' })
    } catch (error) {
      res.send({ status: 500, redirect: '/LogInAdmin', message: error })
    }
  }

  establecerCookieOlvidarContrasena = async (req, res) => {
    try {
      if (!req.params.token) return res.redirect('/LogInAdmin')

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: '/LogInAdmin' })

      const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: '/LogInAdmin'
      }

      res.cookie('rct', req.params.token, cookieOption)
      res.redirect('/recuperacionContrasenaAdmin')
    } catch (error) {
      res.send({ status: 500, redirect: '/LogInAdmin' })
    }
  }

  establecerNuevaContrasena = async (req, res) => {
    try {
      console.log(req.body)
      if (!req.body.Token) return res.redirect('/LogInAdmin')

      const tokenDecodificado = jsonwebtoken.verify(req.body.Token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: '/LogInAdmin' })

      const valores = {
        Correo: tokenDecodificado.Correo,
        Contrasena: req.body.Contrasena
      }

      await this.authenticatorAdminModel.establecerNuevaContrasena({ entrada: valores })

      res.send({ status: 201, message: 'Se cambió correctamente la contraseña', redirect: '/LogInAdmin' })
    } catch (error) {
      return res.send({ status: 401, message: 'Usuario Incorrecto', redirect: '/LogInAdmin' })
    }
  }

  obtenerUsuarioAdminLogueado = async (req, res) => {
    const { token } = req.body

    const decodificada = jsonwebtoken.verify(token, process.env.JWT_SECRET)

    const usuarioARevisar = await this.usuarioAdminModel.obtenerUsuarioAdminPorCorreo(decodificada.Correo)

    if (usuarioARevisar.length === 0) return false

    res.json(usuarioARevisar)
  }
}
