import { Router } from 'express'
import { DeleteUsuarioController } from '../controllers/deleteUsuarioController.js'

export const DelateRouter = (Modelos) => {
  const DeleteUsuarioModel = Router()
  const delateUsuarioController = new DeleteUsuarioController(Modelos)

  DeleteUsuarioModel.get('/:id', delateUsuarioController.borrarPorEmail)

  return DeleteUsuarioModel
}
