import { Router } from 'express'
import { MuseoPlanController } from '../controllers/museoPlan.js'

export const LugarItinerarioRouter = (Modelos) => {
  const MuseoPlanRouter = Router()
  const museoPlanController = new MuseoPlanController(Modelos)

  MuseoPlanRouter.get('/:id', museoPlanController.obtenerLugarItinerarioPorId)
  MuseoPlanRouter.post('/obtenerLugaresItinerario', museoPlanController.obtenerLugaresPorItinerario)
  MuseoPlanRouter.post('/obtenerPrimerLugarSinVisitar', museoPlanController.obtenerPrimerLugarItinerarioSinVisitar)
  MuseoPlanRouter.post('/crearLugarItinerario', museoPlanController.crearLugarItinerario)
  MuseoPlanRouter.post('/eliminarLugarItinerario', museoPlanController.eliminarLugarItinerario)
  MuseoPlanRouter.post('/editarLugarItinerario', museoPlanController.editarLugarItinerario)
  MuseoPlanRouter.post('/editarEstadoLugarItinerario', museoPlanController.editarEstadoLugarItinerario)

  return MuseoPlanRouter
}
