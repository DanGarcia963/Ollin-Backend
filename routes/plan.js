import { Router } from 'express'
import { PlanVisitaController } from '../controllers/plan.js'

export const ItinerarioRouter = (Modelos) => {
  const PlanRouter = Router()
  const planController = new PlanVisitaController(Modelos)

  PlanRouter.get('/:id', planController.obtenerItinerarioPorId)
  PlanRouter.post('/obtenerItinerarios', planController.obtenerItinerariosPorTurista)
  PlanRouter.post('/obtenerItinerariosFinalizados', planController.obtenerItinerariosFinalizados)
  PlanRouter.post('/crearItinerario', planController.crearItinerario)
  PlanRouter.post('/eliminarItinerario', planController.eliminarItinerario)
  PlanRouter.post('/editarEstadoItinerario', planController.editarEstadoItinerario)

  return PlanRouter
}
