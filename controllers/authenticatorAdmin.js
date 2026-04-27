import dotenv from 'dotenv'
import { validarUsuarioAdmin} from '../schema/usuarioAdmin.js'
import { enviarEmailRecuperarContrasenaAdmin, enviarEmailVerificacionAdmin } from '../services/mail.service.js'
import { generarTokenParaCorreo } from '../helpers/token.js'
import jsonwebtoken from 'jsonwebtoken'

dotenv.config()

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ollin-tt.netlify.app'

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

    res.send({ 
      status: 201, 
      message: `Usuario ${nuevoUsuarioAdmin.Nombre} agregado`, 
      redirect: '/LogInAdmin' 
    })
  }

  loginAdmin = async (req, res) => {
    const usuarioLogueado = await this.authenticatorAdminModel.loginAdmin({ entrada: req.body })
    
    if (typeof usuarioLogueado === 'string') {
      return res.send({ status: 401, error: usuarioLogueado })
    }

    if (usuarioLogueado === false) return res.send({ status: 401, message: 'Usuario Incorrecto', redirect: `${FRONTEND_URL}/LogInAdmin` })

    const token = generarTokenParaCorreo(usuarioLogueado.Correo)




    res.send({ 
      status: 200, 
      message: 'Login exitoso', 
      token: token, 
      redirect: `${FRONTEND_URL}/inicioAdmin` 
    })
  }

  verificarCuenta = async (req, res) => {
    try {
      if (!req.params.token) return res.redirect(`${FRONTEND_URL}/LogInAdmin`)

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: `${FRONTEND_URL}/LogInAdmin` })

      await this.authenticatorAdminModel.verificarCuenta(tokenDecodificado.Correo)

      res.redirect(`${FRONTEND_URL}/LogInAdmin`)
    } catch (error) {
      res.send({ status: 500, redirect: `${FRONTEND_URL}/LogInAdmin` })
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

      res.send({ status: 201, message: `Se ha enviado un correo a ${usuarioAdmin.Correo} para crear un nueva contraseña`, redirect: `${FRONTEND_URL}/LogInAdmin` })
    } catch (error) {
      res.send({ status: 500, redirect: `${FRONTEND_URL}/LogInAdmin`, message: error })
    }
  }

  establecerCookieOlvidarContrasena = async (req, res) => {
    try {
      if (!req.params.token) return res.redirect(`${FRONTEND_URL}/LogInAdmin`)

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: `${FRONTEND_URL}/LogInAdmin` })


      res.redirect(`${FRONTEND_URL}/recuperarContrasenaAdmin.html?token=${req.params.token}`)
    } catch (error) {
      res.redirect(`${FRONTEND_URL}/LogInAdmin`)
    }
  }

  establecerNuevaContrasena = async (req, res) => {
    try {
      if (!req.body.Token) {
        return res.redirect(`${FRONTEND_URL}/LogInAdmin`)
      }

      const tokenDecodificado = jsonwebtoken.verify(req.body.Token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) {
        return res.send({ status: 'error', message: 'Error en el token', redirect: `${FRONTEND_URL}/LogInAdmin` })
      }

      const valores = {
        Correo: tokenDecodificado.Correo,
        Contrasena: req.body.Contrasena
      }

      const resultado = await this.authenticatorAdminModel.establecerNuevaContrasena({ entrada: valores })

      if (typeof resultado === 'string') {  
        return res.send({ status: 401, message: resultado, redirect: `${FRONTEND_URL}/LogInAdmin` })
      }

    return res.status(201).json({ message: 'Se cambió correctamente la contraseña', redirect: `${FRONTEND_URL}/` });
  } catch (error) {
    return res.status(401).json({ message: 'Usuario Incorrecto', redirect: `${FRONTEND_URL}/` });
  }
  }

  obtenerUsuarioAdminLogueado = async (req, res) => {
    try{

    const { token } = req.body

    if (!token) {
      return res.status(401).json(false)
    }

    const decodificada = jsonwebtoken.verify(token, process.env.JWT_SECRET)

    let usuarioARevisar = await this.usuarioAdminModel.obtenerUsuarioAdminPorCorreo(decodificada.Correo)

    if (usuarioARevisar.length === 0 || !usuarioARevisar) return res.json(false)


      if(Array.isArray(usuarioARevisar)) {
        usuarioARevisar = usuarioARevisar[0]
      }
      res.json(usuarioARevisar)

    } catch (error) {
      console.error("Error al obtener usuario admin logueado:", error.message)
      res.status(401).json(false)
    }
  }
}