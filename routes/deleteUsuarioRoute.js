import { Router } from 'express'
import { DeleteUsuarioController } from '../controllers/deleteUsuarioController.js'

export const DeleteRouter = (Modelos) => {
  const DeleteUsuarioRouter = Router()
  const deleteUsuarioController = new DeleteUsuarioController(Modelos)

  DeleteUsuarioRouter.post('/eliminarUsuario', deleteUsuarioController.borrarPorEmail)

  return DeleteUsuarioRouter
}
