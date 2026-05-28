import bcryptjs from 'bcryptjs'

const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class UsuarioTuristaModel {

  static async obtenerTodosLosUsuarios ({ nombre = '', estado = '' } = {}) {
    let url = `${SUPABASE_URL}/rest/v1/usuario_turista?select=*`

    const params = []

    if (nombre.trim() !== '') {
      params.push(`Nombre=ilike.${encodeURIComponent(`%${nombre.trim()}%`)}`)
    }

    if (estado === 'Y' || estado === 'N') {
      params.push(`Estado_Cuenta=eq.${estado}`)
    }

    if (params.length > 0) {
      url += `&${params.join('&')}`
    }

    const res = await fetch(url, { headers })
    return await res.json()
  }

  static async obtenerUsuarioTuristaPorCorreo (Correo) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/usuario_turista?Correo=eq.${encodeURIComponent(Correo)}`,
      { method: "GET", headers }
    )

    const data = await response.json()
    if (!data || data.length === 0) return false
    return data[0]
  }

  static async obtenerUsuarioTuristaPorId (id) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/usuario_turista?id=eq.${id}&select=*`,
      { headers }
    )

    const data = await res.json()
    if (data.length === 0) return false
    return data[0]
  }

  static async validarCuenta ({ entrada }) {
    const { id_Turista: idTurista } = entrada

    const existeUsuario = await this.obtenerUsuarioTuristaPorId(idTurista)
    if (!existeUsuario) return 'El usuario no existe'

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuario_turista?id=eq.${idTurista}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Estado_Cuenta: 'Y' })
        }
      )

      return await this.obtenerUsuarioTuristaPorId(idTurista)
    } catch (error) {
      return error
    }
  }

  static async cambiarContraseña ({ entrada }) {
    const { id_Turista: idTurista, Contrasena } = entrada

    const existeUsuario = await this.obtenerUsuarioTuristaPorId(idTurista)
    if (!existeUsuario) return 'El usuario no existe'

    const salt = await bcryptjs.genSalt(10)
    const hashContrasena = await bcryptjs.hash(Contrasena, salt)

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuario_turista?id=eq.${idTurista}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Contrasena: hashContrasena })
        }
      )

      return await this.obtenerUsuarioTuristaPorId(idTurista)
    } catch (error) {
      return error
    }
  }

  static async actualizarNombre({ entrada }) {
    const { id_Turista: idTurista, Nombre } = entrada

    const existeUsuario = await this.obtenerUsuarioTuristaPorId(idTurista)
    if (!existeUsuario) return 'El usuario no existe'

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuario_turista?id=eq.${idTurista}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Nombre })
        }
      )

      return await this.obtenerUsuarioTuristaPorId(idTurista)
    } catch (error) {
      return error
    }
  }

  static async actualizarApellido({ entrada }) {
    const { id_Turista: idTurista, Apellido } = entrada

    const existeUsuario = await this.obtenerUsuarioTuristaPorId(idTurista)
    if (!existeUsuario) return 'El usuario no existe'

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuario_turista?id=eq.${idTurista}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Apellido })
        }
      )

      return await this.obtenerUsuarioTuristaPorId(idTurista)
    } catch (error) {
      return error
    }
  }

  static async actualizarCorreo({ entrada }) {
    const { id_Turista: idTurista, Correo } = entrada

    const existeUsuario = await this.obtenerUsuarioTuristaPorId(idTurista)
    if (!existeUsuario) return 'El usuario no existe'

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuario_turista?id=eq.${idTurista}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Correo })
        }
      )

      return await this.obtenerUsuarioTuristaPorId(idTurista)
    } catch (error) {
      return error
    }
  }
}