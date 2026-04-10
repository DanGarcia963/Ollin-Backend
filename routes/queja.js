import { Router } from 'express'
import { QuejaController } from '../controllers/queja.js'

export const QuejaRouter = (Modelos) => {
  const QuejaRouter = Router()
  const quejaController = new QuejaController(Modelos)

  QuejaRouter.get('/', quejaController.obtenerMuseosConSinQuejas)
  QuejaRouter.post('/obtenerNumQuejasPorMuseo', quejaController.obtenerNumQuejasPorMuseo)
  QuejaRouter.post('/crearQueja', quejaController.crearQueja)

  return QuejaRouter
}
