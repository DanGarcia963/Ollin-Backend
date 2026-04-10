import bcryptjs from 'bcryptjs'

const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class UsuarioAdminModel {

  static async obtenerTodosLosAdmins () {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/administrador?select=*`,
      { headers }
    )

    return await res.json()
  }

  static async obtenerUsuarioAdminPorCorreo (Correo) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/administrador?Correo=eq.${encodeURIComponent(Correo)}`,
      {
        method: "GET",
        headers
      }
    )

    const data = await res.json()

    if (!data || data.length === 0) return false
    return data[0]
  }

  static async obtenerUsuarioAdminPorId (id) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/administrador?id_Administrador=eq.${id}&select=*`,
      { headers }
    )

    const data = await res.json()

    if (data.length === 0) return false
    return data[0]
  }

  static async cambiarContraseña ({ entrada }) {
    const {
      id_Admin: idAdmin, Contrasena
    } = entrada

    const existeUsuario = await this.obtenerUsuarioAdminPorId(idAdmin)

    if (!existeUsuario) return 'El usuario no existe'

    const salt = await bcryptjs.genSalt(10)
    const hashContrasena = await bcryptjs.hash(Contrasena, salt)

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/administrador?id_Administrador=eq.${idAdmin}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Contrasena: hashContrasena })
        }
      )

      return await this.obtenerUsuarioAdminPorId(idAdmin)

    } catch (error) {
      return error
    }
  }

    static async actualizarNombre({ entrada }) {
    const { id_Admin: idAdmin, Nombre } = entrada

    const existeUsuario = await this.obtenerUsuarioAdminPorId(idAdmin)
    if (!existeUsuario) return 'El usuario no existe'

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/administrador?id_Administrador=eq.${idAdmin}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Nombre })
        }
      )

      return await this.obtenerUsuarioAdminPorId(idAdmin)

    } catch (error) {
      return error
    }
  }

  static async actualizarApellido({ entrada }) {
    const { id_Admin: idAdmin, Apellido } = entrada

    const existeUsuario = await this.obtenerUsuarioAdminPorId(idAdmin)
    if (!existeUsuario) return 'El usuario no existe'

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/administrador?id_Administrador=eq.${idAdmin}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Apellido })
        }
      )

      return await this.obtenerUsuarioAdminPorId(idAdmin)

    } catch (error) {
      return error
    }
  }

  static async actualizarCorreo({ entrada }) {
    const {
      id_Admin: idAdmin, Correo
    } = entrada

    const existeUsuario = await this.obtenerUsuarioAdminPorId(idAdmin)

    if (!existeUsuario) return 'El usuario no existe'

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/administrador?id_Administrador=eq.${idAdmin}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Correo })
        }
      )

      return await this.obtenerUsuarioAdminPorId(idAdmin)

    } catch (error) {
      return error
    }
  }

    static async borrarPorEmail(id) {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/administrador?id_Administrador=eq.${id}`,
        {
          method: "DELETE",
          headers
        }
      );
    } catch (error) {
      throw new Error('Error al borrar el usuario: ' + error.message);
    }
  }

}