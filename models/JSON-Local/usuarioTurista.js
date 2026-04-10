import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils.js'

const usuariosTuristas = readJSON('./usuarioTurista.json')

export class UsuarioTuristaModel {
  static async obtenerTodosLosUsuarios () {
    return usuariosTuristas
  }

  static async obtenerUsuarioTuristaPorId ({ id }) {
    const usuarioTurista = usuariosTuristas.find(usuario => usuario.id === id)

    return usuarioTurista
  }

  static async obtenerUsuarioTuristaPorCorreo ({ correo }) {
    const usuarioTurista = usuariosTuristas.find(usuario => usuario.Correo === correo)

    return usuarioTurista
  }

  static async crearUsuarioTurista ({ entrada }) {
    const nuevoUsuarioTurista = {
      id: randomUUID(),
      ...entrada
    }

    usuariosTuristas.push(nuevoUsuarioTurista)

    return nuevoUsuarioTurista
  }

  static async obtenerUsuarioTuristaPorNombreUsuario ({ entrada }) {
    const { Nombre_Usuario: nombreUsuario, Contrasena } = entrada

    const usuarioTurista = usuariosTuristas.find(usuario => usuario.Nombre_Usuario === nombreUsuario)

    if (!usuarioTurista) return []

    if (usuarioTurista.Contrasena !== Contrasena) return []

    return usuarioTurista
  }
}
