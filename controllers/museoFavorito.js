export class MuseoFavoritoController {
  constructor (Modelos) {
    this.museoFavoritoModel = Modelos.MuseoFavoritoModel
    this.museoModel = Modelos.MuseoModel
  }

  obtenerTodosLosLugaresFavoritos = async (req, res) => {
    const lugaresFavoritos = await this.museoFavoritoModel.obtenerTodosLosLugaresFavoritos(req.body.idTurista)
    res.json(lugaresFavoritos)
  }

  obtenerLugarFavoritoPorId = async (req, res) => {
    const { id } = req.params

    const lugarFavorito = await this.museoFavoritoModel.obtenerLugarFavoritoPorId(id)

    if (lugarFavorito) return res.json(lugarFavorito)

    res.status(404).json({ message: 'Museo no encontrado' })
  }

  obtenerLugarFavoritoPorIdLugarDeUnTurista = async (req, res) => {
    const { id_Museo, id_Turista } = req.body

    const lugarFavorito = await this.museoFavoritoModel.obtenerLugarFavoritoPorIdLugarDeUnTurista({ entrada: { id_Museo, id_Turista } })

    if (lugarFavorito) return res.json(lugarFavorito)

    res.status(404).json({ message: 'Este Museo no está marcado como favorito' })
  }

  crearLugarFavorito = async (req, res) => {
    const { id_Museo, Nombre, id_Turista } = req.body

    const existeLugarFavorito = await this.museoFavoritoModel.obtenerLugarFavoritoPorIdLugarDeUnTurista({ entrada: { id_Museo, id_Turista } })

    if (existeLugarFavorito) {
      const resultado = await this.museoFavoritoModel.eliminarLugarFavorito(existeLugarFavorito.id_Museo_Favorito)
      return res.json(resultado)
    }

    let existeLugar = await this.museoModel.obtenerLugarPorId(id_Museo)

    if (!existeLugar) {
      existeLugar = await this.museoModel.crearLugar({ entrada: { id_Museo, Nombre } })
    }
    const nuevoLugarFavorito = await this.museoFavoritoModel.crearLugarFavorito({ entrada: { id_Museo, id_Turista } })
    res.json(nuevoLugarFavorito)
  }

  eliminarLugarFavorito = async (req, res) => {
    const { id_Museo, id_Turista } = req.body

    const existeLugarFavorito = await this.museoFavoritoModel.obtenerLugarFavoritoPorIdLugarDeUnTurista({ entrada: { id_Museo, id_Turista } })

    if (existeLugarFavorito) {
      const resultado = await this.museoFavoritoModel.eliminarLugarFavorito(existeLugarFavorito.id_Museo_Favorito)
      return res.json(resultado)
    }

    res.status(404).json({ message: 'Museo Favorito no encontrado' })
  }
}
