import bcryptjs from 'bcryptjs'
import { UsuarioAdminModel } from '../MySQL/usuarioAdmin.js'

const usuarioAdminModel = UsuarioAdminModel

const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class AuthenticatorAdminModel {

  static async registrarUsuarioAdmin ({ entrada }) {
    const {
      Nombre, Apellido, Correo, Contrasena
    } = entrada

    const usuarioAdminPorCorreo = await usuarioAdminModel.obtenerUsuarioAdminPorCorreo(Correo)

    if (usuarioAdminPorCorreo && usuarioAdminPorCorreo.length > 0) return 'Ya existe un usuario con ese correo'

    const salt = await bcryptjs.genSalt(10)
    const hashContrasena = await bcryptjs.hash(Contrasena, salt)

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/administrador`,
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
            Estado_Cuenta: "N"
          })
        }
      )
      if(!response.ok) {
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

  static async loginAdmin ({ entrada }) {
    const { Correo, Contrasena } = entrada

    const usuarioAdmin = await usuarioAdminModel.obtenerUsuarioAdminPorCorreo(Correo)

    if (usuarioAdmin === false || !usuarioAdmin) return 'Usuario no encontrado'

    if(!usuarioAdmin.Contrasena) return 'El usuario no tiene contraseña asignada. Por favor, contacta al administrador del sistema.'

    const loginCorrecto = await bcryptjs.compare(Contrasena, usuarioAdmin.Contrasena)
    
    if(!loginCorrecto) return 'Contraseña incorrecta'

    if(usuarioAdmin.Estado_Cuenta === 'N') return 'La cuenta de este usuario está inactiva. Por favor, contacta al administrador del sistema.'

    return usuarioAdmin
  }

    static async verificarCuenta (Correo) {
    try {
      const usuarioAdmin = await usuarioAdminModel.obtenerUsuarioAdminPorCorreo(Correo)

      if (usuarioAdmin === false) return 'Usuario no encontrado'

      await fetch(
        `${SUPABASE_URL}/rest/v1/administrador?Correo=eq.${encodeURIComponent(Correo)}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Estado_Cuenta: "Y" })
        }
      )

      const usuarioVerificado = await usuarioAdminModel.obtenerUsuarioAdminPorCorreo(Correo)

      return usuarioVerificado
    } catch (error) {
      return error
    }
  }

  static async olvidarContrasena (Correo) {
    try {
      const usuarioAdmin = await usuarioAdminModel.obtenerUsuarioAdminPorCorreo(Correo)

      if (usuarioAdmin === false) return 'Usuario no registrado en la base de datos'

      return usuarioAdmin
    } catch (error) {
      return error
    }
  }

  static async establecerNuevaContrasena ({ entrada }) {
    const { Correo, Contrasena } = entrada

    try {
      const usuarioAdmin = await usuarioAdminModel.obtenerUsuarioAdminPorCorreo(Correo)

      if (usuarioAdmin === false) return 'Usuario no registrado en la base de datos'

      const salt = await bcryptjs.genSalt(10)
      const hashContrasena = await bcryptjs.hash(Contrasena, salt)

      await fetch(
        `${SUPABASE_URL}/rest/v1/administrador?Correo=eq.${encodeURIComponent(Correo)}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Contrasena: hashContrasena })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const usuarioAdminModificado = await usuarioAdminModel.obtenerUsuarioAdminPorCorreo(Correo)

      return usuarioAdminModificado
    } catch (error) {
      return error
    }
  }
}