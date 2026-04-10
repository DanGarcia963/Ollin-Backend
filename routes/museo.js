import { Router } from 'express'
import { MuseoController } from '../controllers/museo.js'

export const LugarRouter = (Modelos) => {
  const LugarRouter = Router()
  const museoController = new MuseoController(Modelos)

  LugarRouter.get('/', museoController.obtenerTodosLosLugares)
  LugarRouter.get('/:id', museoController.obtenerLugarPorId)
  LugarRouter.post('/crearLugar', museoController.crearLugar)

  return LugarRouter
}
