import { Router } from 'express'
import { DeleteUsuarioController } from '../controllers/deleteUsuarioController.js'

export const DeleteRouter = (Modelos) => {
  const DeleteUsuarioModel = Router()
  const deleteUsuarioController = new DeleteUsuarioController(Modelos)

  DeleteUsuarioModel.post('/', deleteUsuarioController.borrarPorEmail)

  return DeleteUsuarioModel
}
