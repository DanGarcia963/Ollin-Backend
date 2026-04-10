// UpdateUsuarioRoute.js
import { Router } from 'express'
import { UpdateUsuarioController } from '../controllers/UpdateUsuarioController.js'

export const UpdateUsuarioRouter = (Modelos) => {
  const UpdateUsuarioModel = Router()
  const updateUsuarioController = new UpdateUsuarioController(Modelos)

  // Ruta para actualizar la fecha de nacimiento del usuario
  UpdateUsuarioModel.put('/fechaNacimiento/:id', updateUsuarioController.actualizarFechaNacimiento)

  return UpdateUsuarioModel
}
