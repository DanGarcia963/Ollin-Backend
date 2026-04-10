export class MuseoVisitadoController {
  constructor (Modelos) {
    this.museoVisitadoModel = Modelos.MuseoVisitadoModel
    this.museoModel = Modelos.MuseoModel
  }

  obtenerTodosLosLugaresVisitados = async (req, res) => {
    const lugaresVisitados = await this.museoVisitadoModel.obtenerTodosLosLugaresVisitados(req.body.idTurista)
    res.json(lugaresVisitados)
  }

  obtenerLugarVisitadoPorId = async (req, res) => {
    const { id } = req.params

    const lugarVisitado = await this.museoVisitadoModel.obtenerLugarVisitadoPorId(id)

    if (lugarVisitado) return res.json(lugarVisitado)

    res.status(404).json({ message: 'Museo Visitado no encontrado' })
  }

  obtenerLugarVisitadoPorIdLugarDeUnTurista = async (req, res) => {
    const { id_Museo, id_Turista } = req.body

    const lugarVisitado = await this.museoVisitadoModel.obtenerLugarVisitadoPorIdLugarDeUnTurista({ entrada: { id_Museo, id_Turista } })

    if (lugarVisitado) return res.json(lugarVisitado)

    res.status(404).json({ message: 'Este Museo no está marcado como visitado' })
  }

  crearLugarVisitado = async (req, res) => {
    const { id_Museo, Nombre, id_Turista } = req.body

    const existeLugarVisitado = await this.museoVisitadoModel.obtenerLugarVisitadoPorIdLugarDeUnTurista({ entrada: { id_Museo, id_Turista } })

    if (existeLugarVisitado) {
      const resultado = await this.museoVisitadoModel.eliminarLugarVisitado(existeLugarVisitado.id_Museo_Visitado)
      return res.json(resultado)
    }

    let existeLugar = await this.museoModel.obtenerLugarPorId(id_Museo)

    if (!existeLugar) {
      existeLugar = await this.museoModel.crearLugar({ entrada: { id_Museo, Nombre } })
    }

    const nuevoLugarVisitado = await this.museoVisitadoModel.crearLugarVisitado({ entrada: { id_Museo, id_Turista } })
    res.json(nuevoLugarVisitado)
  }

  eliminarLugarVisitado = async (req, res) => {
    const { id_Museo, id_Turista } = req.body

    const existeLugarVisitado = await this.museoVisitadoModel.obtenerLugarVisitadoPorIdLugarDeUnTurista({ entrada: { id_Museo, id_Turista } })

    if (existeLugarVisitado) {
      const resultado = await this.museoVisitadoModel.eliminarLugarVisitado(existeLugarVisitado.id_Museo_Visitado)
      return res.json(resultado)
    }

    res.status(404).json({ message: 'Museo visitado no encontrado' })
  }
  
  obtenerNumMuseoMes = async (req, res) => {
    const cantidad = await this.museoVisitadoModel.obtenerNumMuseoMes(req.body.idTurista)

    res.json({cantidad})
  }

  obtenerNumMuseoAno = async (req, res) => {
    const cantidad = await this.museoVisitadoModel.obtenerNumMuseoAno(req.body.idTurista)

    res.json({cantidad})
  }

  recomendarMuseos = async (req, res) => {
    const museosRecomendados = await this.museoVisitadoModel.recomendarMuseos()

    res.json(museosRecomendados)
  }

}
