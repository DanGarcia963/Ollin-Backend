import dotenv from 'dotenv'
import { validarUsuarioTurista } from '../schema/usuarioTurista.js'
import { enviarEmailRecuperarContrasena, enviarEmailVerificacion } from '../services/mail.service.js'
import { generarTokenParaCorreo } from '../helpers/token.js'
import jsonwebtoken from 'jsonwebtoken'

dotenv.config()

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ollin-tt.netlify.app'

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
      redirect: '/'
    })
  }

  login = async (req, res) => {
    const usuarioLogueado = await this.authenticatorModel.login({ entrada: req.body })

    if (typeof usuarioLogueado === 'string') {
      return res.send({ status: 401, error: usuarioLogueado })
    }

    if (usuarioLogueado === false) return res.send({ status: 401, message: 'Usuario Incorrecto', redirect: `${FRONTEND_URL}/` })

    const token = generarTokenParaCorreo(usuarioLogueado.Correo)

    await this.authenticatorModel.guardarUltimoLogin(usuarioLogueado.Correo)

    // ¡ADIÓS COOKIES, HOLA TOKEN DIRECTO!
    res.send({ 
      status: 201, 
      message: `Usuario ${usuarioLogueado.Nombre} logueado`, 
      redirect: `${FRONTEND_URL}/inicio`,
      token: token // Enviamos la llave maestra al frontend
    })
  }

  verificarCuenta = async (req, res) => {
    try {
      if (!req.params.token) return res.redirect(`${FRONTEND_URL}/`)

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.send({ status: 'error', message: 'Error en el token', redirect: `${FRONTEND_URL}/` })

      await this.authenticatorModel.verificarCuenta(tokenDecodificado.Correo)

      res.redirect(`${FRONTEND_URL}/Cuenta_verificada.html`)
    } catch (error) {
      res.redirect(`${FRONTEND_URL}/`)
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

      res.send({ status: 201, message: `Se ha enviado un correo a ${usuarioTurista.Correo} para crear un nueva contraseña`, redirect: `${FRONTEND_URL}/` })
    } catch (error) {
      res.send({ status: 500, redirect: `${FRONTEND_URL}/`, message: error })
    }
  }

  establecerCookieOlvidarContrasena = async (req, res) => {
    try {
      if (!req.params.token) return res.redirect(`${FRONTEND_URL}/`)

      const tokenDecodificado = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET)

      if (!tokenDecodificado || !tokenDecodificado.Correo) return res.redirect(`${FRONTEND_URL}/`)

      // Aquí sí usamos redirección con parámetros en URL para pasar el token sin cookies
      res.redirect(`${FRONTEND_URL}/cambiar_contraseña?token=${req.params.token}`)
    } catch (error) {
      res.redirect(`${FRONTEND_URL}/`)
    }
  }

establecerNuevaContrasena = async (req, res) => {
  try {
    if (!req.body.Token) {
      return res.status(400).json({ message: 'Falta Token', redirect: `${FRONTEND_URL}/` });
    }

    const tokenDecodificado = jsonwebtoken.verify(req.body.Token, process.env.JWT_SECRET);

    if (!tokenDecodificado || !tokenDecodificado.Correo) {
      return res.status(401).json({ message: 'Error en el token', redirect: `${FRONTEND_URL}/` });
    }

    const valores = {
      Correo: tokenDecodificado.Correo,
      Contrasena: req.body.Contrasena
    };

    const resultado = await this.authenticatorModel.establecerNuevaContrasena({ entrada: valores });

    if (typeof resultado === 'string') {
      return res.status(404).json({ message: resultado, redirect: `${FRONTEND_URL}/` });
    }

    return res.status(201).json({ message: 'Se cambió correctamente la contraseña', redirect: `${FRONTEND_URL}/` });
  } catch (error) {
    return res.status(401).json({ message: 'Usuario Incorrecto', redirect: `${FRONTEND_URL}/` });
  }
}

  obtenerUsuarioLogueado = async (req, res) => {
    try {
      // Recibe el token del body que le manda tu nuevo admin.js
      const { token } = req.body;

      if (!token) {
        return res.status(401).json(false);
      }

      const decodificada = jsonwebtoken.verify(token, process.env.JWT_SECRET)

      let usuarioARevisar = await this.usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(decodificada.Correo)

      if (!usuarioARevisar || usuarioARevisar.length === 0) return res.json(false)

      // PARCHE PARA EL ID: Si viene como arreglo de Supabase, sacamos el objeto
      if (Array.isArray(usuarioARevisar)) {
          usuarioARevisar = usuarioARevisar[0]
      }

      res.json(usuarioARevisar)

    } catch (error) {
      console.error("Error validando sesión:", error.message);
      res.status(401).json(false);
    }
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