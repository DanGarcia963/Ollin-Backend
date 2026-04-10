import { Router } from 'express'
import { EventoController } from '../controllers/evento.js'

export const EventoRouter = (Modelos) => {
  const EventoRouter = Router()
  const eventoController = new EventoController(Modelos)

  EventoRouter.post('/obtenerDescripcionEvento', eventoController.obtenerDescripcionEvento)
  EventoRouter.post('/obtenerMuseosPorEvento', eventoController.obtenerMuseosPorEvento)
  EventoRouter.post('/obtenerEventosConMuseos', eventoController.obtenerEventosConMuseos)

  return EventoRouter
}