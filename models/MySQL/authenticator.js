import bcryptjs from 'bcryptjs'
import { UsuarioTuristaModel } from '../MySQL/usuarioTurista.js'

const usuarioTuristaModel = UsuarioTuristaModel

const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class AuthenticatorModel {

  static async registrarUsuarioTurista ({ entrada }) {
  const {
    Nombre, Apellido, Correo, Contrasena, Fecha_Nacimiento: fechaNacimiento
  } = entrada

  const usuarioTuristaPorCorreo = await usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

  if (usuarioTuristaPorCorreo && usuarioTuristaPorCorreo.length > 0) return 'Ya existe un usuario con ese correo'

  const salt = await bcryptjs.genSalt(10)
  const hashContrasena = await bcryptjs.hash(Contrasena, salt)

  const fechaNacimientoConFormato = fechaNacimiento

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/usuario_turista`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "return=representation" 
        },
        body: JSON.stringify({
          Nombre,
          Apellido,
          Correo,
          Contrasena: hashContrasena,
          Fecha_Nacimiento: fechaNacimientoConFormato,
          Estado_Cuenta: "N"
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("❌ Error Supabase:", errorData)
      throw new Error(errorData)
    }

    const data = await response.json()

    return data[0]

  } catch (error) {
    throw new Error(error)
  }
}

  static async login ({ entrada }) {
    const { Correo, Contrasena } = entrada

    const usuarioTurista = await usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

if (!usuarioTurista || usuarioTurista === false) {
  return 'Usuario no encontrado'
}

if (!usuarioTurista.Contrasena) {
  return 'Error: el usuario no tiene contraseña registrada'
}

const loginCorrecto = await bcryptjs.compare(
  Contrasena,
  usuarioTurista.Contrasena
)

if(!loginCorrecto) return 'Contraseña incorrecta'

    if (usuarioTurista.Estado_Cuenta === 'N') return 'Para iniciar sesión debes verificar tu cuenta de correo'

    return usuarioTurista
  }

  static async verificarCuenta (Correo) {
    try {
      const usuarioTurista = await usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

      if (usuarioTurista === false) return 'Usuario no encontrado'

      await fetch(
        `${SUPABASE_URL}/rest/v1/usuario_turista?Correo=eq.${encodeURIComponent(Correo)}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Estado_Cuenta: "Y" })
        }
      )

      const usuarioVerificado = await usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

      return usuarioVerificado
    } catch (error) {
      return error
    }
  }

  static async olvidarContrasena (Correo) {
    try {
      const usuarioTurista = await usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

      if (usuarioTurista === false) return 'Usuario no registrado en la base de datos'

      return usuarioTurista
    } catch (error) {
      return error
    }
  }

  static async establecerNuevaContrasena ({ entrada }) {
    const { Correo, Contrasena } = entrada

    try {
      const usuarioTurista = await usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

      if (usuarioTurista === false) return 'Usuario no registrado en la base de datos'

      const salt = await bcryptjs.genSalt(10)
      const hashContrasena = await bcryptjs.hash(Contrasena, salt)

const response = await fetch(
  `${SUPABASE_URL}/rest/v1/usuario_turista?Correo=eq.${encodeURIComponent(Correo)}`,
  {
    method: "PATCH",
    headers,
    body: JSON.stringify({ Contrasena: hashContrasena })
  }
);

if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`Error al actualizar la contraseña: ${errorText}`);
}

      const usuarioTuristaModificado = await usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

      return usuarioTuristaModificado
    } catch (error) {
      return error
    }
  }

  static async guardarUltimoLogin (Correo) {
    try {
      const usuarioTurista = await usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

      if (usuarioTurista === false) return 'Usuario no registrado en la base de datos'
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuario_turista?Correo=eq.${encodeURIComponent(Correo)}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ last_login: new Date().toISOString() })
        }
      )
      const usuarioTuristaModificado = await usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

      return usuarioTuristaModificado
    }
      catch (error) {
        return error
      }
    }
}