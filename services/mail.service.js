import Mailjet from 'node-mailjet'

import dotenv from 'dotenv'
dotenv.config()

// Funciones para usuarios turistas

export const enviarEmailVerificacion = async (direccion, nombre, token) => {
  try {
    const mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET
    })
    console.log('EMAIL A ENVIAR', {
      from: {
        email: process.env.MAILJET_SENDER,
        name: process.env.MAILJET_SEND_NAME
      },
      to: {
        email: direccion,
        name: nombre
      }
    })
    const resultadoEmail = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER,
            Name: process.env.MAILJET_SEND_NAME
          },
          To: [
            {
              Email: direccion,
              Name: nombre
            }
          ],
          Subject: 'Verificación de nueva cuenta - Ollin',
          TextPart: 'Verificación de nueva cuenta - Ollin',
          HTMLPart: crearMailVerificacion(token)
        }
      ]
    })

    return resultadoEmail
  } catch (error) {
    console.log('Something went wrong', error.message)

    // Devuelve un objeto con estructura conocida para evitar errores posteriores
    return {
      response: {
        statusText: 'ERROR',
        status: 400,
      },
      error: error.message
    }
  }
}

const crearMailVerificacion = (token) => {
  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Cuenta</title>
    <style>
      body {
      font-family: "Montserrat", Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
          display: block;
          width: 60%;
          max-width: 460px;
          min-width: 232px;
          height: fit-content !important;
          margin: 20px auto;
          padding: 20px;
          background-color: #EFEDED;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          color:black;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 15px;
      }
      a.button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #65B2C6;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
      a.button:hover {
        background-color: #3b6873;
      }
      .logo {
      width: 130px;
      position: relative;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      }
      h1{
          margin: 12px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Ollin</h1>
      <p>Gracias por registrarte. Para verificar tu cuenta, haz clic en el siguiente botón:</p>
      <a href="http://ollin-backend-production.up.railway.app/api/authenticator/verificarCuenta/${token}" class="button">Verificar Cuenta</a>
    </div>
  </body>
  </html>`
}

export const enviarEmailRecuperarContrasena = async (direccion, nombre, token) => {
  try {
    const mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET
    })
    const resultadoEmail = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER,
            Name: process.env.MAILJET_SEND_NAME
          },
          To: [
            {
              Email: direccion,
              Name: nombre
            }
          ],
          Subject: 'Recuperar contraseña - Ollin',
          TextPart: 'Recuperar contraseña - Ollin',
          HTMLPart: crearMailOlvidarContrasena(token)
        }
      ]
    })

    return resultadoEmail
  } catch (error) {
    console.log('Something went wrong', error.message)
  }
}

const crearMailOlvidarContrasena = (token) => {
  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correo de nueva contraseña</title>
    <style>
      body {
          font-family: "Montserrat", Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 0;
      }
      .container {
          display: block;
          width: 60%;
          max-width: 460px;
          min-width: 232px;
          height: fit-content !important;
          margin: 20px auto;
          padding: 20px;
          background-color: #EFEDED;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          color:black;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 15px;
      }
      a.button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #65B2C6;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
      a.button:hover {
        background-color: #3b6873;
      }
      h1{
          margin: 12px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Ollin</h1>
      <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
      <a href="http://ollin-backend-production.up.railway.app/api/authenticator/recuperarContrasena/${token}" class="button"><b>Recuperar contraseña</b></a>
    </div>
  </body>
  </html>`
}

// Funciones específicas para administradores

export const enviarEmailVerificacionAdmin = async (direccion, nombre, token) => {
    try {
    const mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET
    })
    console.log('EMAIL A ENVIAR', {
      from: {
        email: process.env.MAILJET_SENDER,
        name: process.env.MAILJET_SEND_NAME
      },
      to: {
        email: direccion,
        name: nombre
      }
    })
    const resultadoEmail = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER,
            Name: process.env.MAILJET_SEND_NAME
          },
          To: [
            {
              Email: direccion,
              Name: nombre
            }
          ],
          Subject: 'Verificación de nueva cuenta Administrador - Ollin',
          TextPart: 'Verificación de nueva cuenta Administrador - Ollin',
          HTMLPart: crearMailVerificacionAdmin(token)
        }
      ]
    })

    return resultadoEmail
  } catch (error) {
    console.log('Something went wrong', error.message)

    // Devuelve un objeto con estructura conocida para evitar errores posteriores
    return {
      response: {
        statusText: 'ERROR',
        status: 400,
      },
      error: error.message
    }
  }
}

const crearMailVerificacionAdmin = (token) => {
return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Cuenta</title>
    <style>
      body {
      font-family: "Montserrat", Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
          display: block;
          width: 60%;
          max-width: 460px;
          min-width: 232px;
          height: fit-content !important;
          margin: 20px auto;
          padding: 20px;
          background-color: #EFEDED;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          color:black;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 15px;
      }
      a.button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #65B2C6;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
      a.button:hover {
        background-color: #3b6873;
      }
      .logo {
      width: 130px;
      position: relative;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      }
      h1{
          margin: 12px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Ollin - Administrador</h1>
      <p>Gracias por registrarte. Para verificar tu cuenta, haz clic en el siguiente botón:</p>
      <a href="http://ollin-backend-production.up.railway.app/api/authenticatorAdmin/verificarCuenta/${token}" class="button">Verificar Cuenta</a>
    </div>
  </body>
  </html>`
}

export const enviarEmailRecuperarContrasenaAdmin = async (direccion, nombre, token) => {
  try {
    const mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET
    })
    const resultadoEmail = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER,
            Name: process.env.MAILJET_SEND_NAME
          },
          To: [
            {
              Email: direccion,
              Name: nombre
            }
          ],
          Subject: 'Recuperar contraseña Administrador - Ollin',
          TextPart: 'Recuperar contraseña Administrador - Ollin',
          HTMLPart: crearMailOlvidarContrasenaAdmin(token)
        }
      ]
    })

    return resultadoEmail
  } catch (error) {
    console.log('Something went wrong', error.message)
  }
}

const crearMailOlvidarContrasenaAdmin = (token) => {
  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correo de nueva contraseña</title>
    <style>
      body {
          font-family: "Montserrat", Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 0;
      }
      .container {
          display: block;
          width: 60%;
          max-width: 460px;
          min-width: 232px;
          height: fit-content !important;
          margin: 20px auto;
          padding: 20px;
          background-color: #EFEDED;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          color:black;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 15px;
      }
      a.button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #65B2C6;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }
      a.button:hover {
        background-color: #3b6873;
      }
      h1{
          margin: 12px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Ollin - Administrador</h1>
      <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
      <a href="http://ollin-backend-production.up.railway.app/api/authenticatorAdmin/recuperarContrasena/${token}" class="button"><b>Recuperar contraseña</b></a>
    </div>
  </body>
  </html>`
}

export const enviarEmailCambioEstadoMuseo = async (direccion, nombre, museo, token) => {
  try {
    const mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET
    })
    const resultadoEmail = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER,
            Name: process.env.MAILJET_SEND_NAME
          },
          To: [
            {
              Email: direccion,
              Name: nombre
            } 
          ],
          Subject: `Cambio de estado del museo - Ollin`,
          TextPart: `Cambio de estado del museo - Ollin`,
          HTMLPart: crearMailCambioEstadoMuseo(museo, nombre, token)
        }
      ]
    })

    return resultadoEmail
  } catch (error) {
    console.log('Something went wrong', error.message)
  }
}

const crearMailCambioEstadoMuseo = (museo, nombre, token) => {
  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambio de estado del museo</title>
    <style>
      body {
          font-family: "Montserrat", Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 0;
      }
      .container {
          display: block;
          width: 60%;
          max-width: 460px;
          min-width: 232px;
          height: fit-content !important;
          margin: 20px auto;
          padding: 20px;
          background-color: #EFEDED;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          color:black;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 15px;
      }
      h1{
          margin: 12px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Ollin - Administrador</h1>
      <p>Hola, ${nombre}.</p>
      <p>El estado de ${museo.Nombre} ha cambiado y se encuentra cerrado por quejas recientes.</p>
      <p>Te recomendamos revisar el museo para más detalles.</p>
      <a href="http://ollin-backend-production.up.railway.app/api/authenticator/verificarCuenta/${token}" class="button">Ir a ver</a>
    </div>
  </body>
  </html>`
}

export const enviarEmailCambioEstadoMuseoPlan = async (direccion, nombre, museo, nombrePlan, token) => {
  try {
    const mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET
    })
    const resultadoEmail = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER,
            Name: process.env.MAILJET_SEND_NAME
          },  
          To: [
            {
              Email: direccion,
              Name: nombre
            } 
          ],
          Subject: `Cambio de estado del museo - Ollin`,
          TextPart: `Cambio de estado del museo - Ollin`,
          HTMLPart: crearMailCambioEstadoMuseoPlan(museo, nombre, nombrePlan, token)
        }
      ]
    })
    return resultadoEmail
  } catch (error) {
    console.log('Something went wrong', error.message)
  }
}

const crearMailCambioEstadoMuseoPlan = (museo, nombre, nombrePlan, token) => {
  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambio de estado del museo</title>
    <style>
      body {
          font-family: "Montserrat", Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 0;
      }
      .container {
          display: block;
          width: 60%;
          max-width: 460px;
          min-width: 232px;
          height: fit-content !important;
          margin: 20px auto;
          padding: 20px;
          background-color: #EFEDED;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          color:black;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 15px;
      }
      h1{
          margin: 12px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Ollin - Administrador</h1>
      <p>Hola, ${nombre}.</p>
      <p>El estado de ${museo.Nombre} ha cambiado y se encuentra cerrado por quejas recientes.</p>
      <p>Este museo se encuentra agregado en tu plan de visita ${nombrePlan}.</p>
      <a href="http://ollin-backend-production.up.railway.app/api/authenticator/verificarCuenta/${token}" class="button">Ir a ver</a>
    </div>
  </body>
  </html>`
}
