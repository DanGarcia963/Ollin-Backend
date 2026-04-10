/* eslint camelcase: "off" */

import z from 'zod'

const usuarioAdminEsquema = z.object({
  Nombre: z.string({
    invalid_type_error: 'El nombre debe ser una cadena de texto',
    required_error: 'El nombre es un campo requerido'
  }).max(20),
  Apellido: z.string({
    invalid_type_error: 'El apellido debe ser una cadena de texto',
    required_error: 'El apellido es un campo requerido'
  }).max(30),
  Correo: z.string({
    invalid_type_error: 'El correo debe ser una cadena de texto',
    required_error: 'El correo es un campo requerido'
  }).max(50).email(),
  Contrasena: z.string({
    invalid_type_error: 'La contraseña debe ser una cadena de texto',
    required_error: 'La contraseña es un campo requerido'
  }).max(50),
})

export function validarUsuarioAdmin (input) {
  return usuarioAdminEsquema.safeParse(input)
}
