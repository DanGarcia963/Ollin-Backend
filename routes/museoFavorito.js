import { Router } from 'express'
import { MuseoFavoritoController } from '../controllers/museoFavorito.js'

export const LugarFavoritoRouter = (Modelos) => {
  const MuseoFavoritoRouter = Router()
  const museoFavoritoController = new MuseoFavoritoController(Modelos)

  MuseoFavoritoRouter.get('/:id', museoFavoritoController.obtenerLugarFavoritoPorId)
  MuseoFavoritoRouter.post('/obtenerLugaresFavoritos', museoFavoritoController.obtenerTodosLosLugaresFavoritos)
  MuseoFavoritoRouter.post('/crearLugarFavorito', museoFavoritoController.crearLugarFavorito)
  MuseoFavoritoRouter.post('/obtenerLugarFavoritoIdlugar', museoFavoritoController.obtenerLugarFavoritoPorIdLugarDeUnTurista)
  MuseoFavoritoRouter.post('/eliminarLugarFavorito', museoFavoritoController.eliminarLugarFavorito)

  return MuseoFavoritoRouter
}
