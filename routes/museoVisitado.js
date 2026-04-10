import { Router } from 'express'
import { MuseoVisitadoController } from '../controllers/museoVisitado.js'

export const LugarVisitadoRouter = (Modelos) => {
  const MuseoVisitadoRouter = Router()
  const museoVisitadoController = new MuseoVisitadoController(Modelos)

  MuseoVisitadoRouter.get('/:id', museoVisitadoController.obtenerLugarVisitadoPorId)
  MuseoVisitadoRouter.post('/obtenerLugaresVisitados', museoVisitadoController.obtenerTodosLosLugaresVisitados)
  MuseoVisitadoRouter.post('/crearLugarVisitado', museoVisitadoController.crearLugarVisitado)
  MuseoVisitadoRouter.post('/obtenerLugarVisitadoIdlugar', museoVisitadoController.obtenerLugarVisitadoPorIdLugarDeUnTurista)
  MuseoVisitadoRouter.post('/eliminarLugarVisitado', museoVisitadoController.eliminarLugarVisitado)
  MuseoVisitadoRouter.post('/obtenerNumMuseoVisitadoMes', museoVisitadoController.obtenerNumMuseoMes)
  MuseoVisitadoRouter.post('/obtenerNumMuseoVisitadoAno', museoVisitadoController.obtenerNumMuseoAno)
  MuseoVisitadoRouter.post('/recomendarMuseos', museoVisitadoController.recomendarMuseos)

  return MuseoVisitadoRouter
}
