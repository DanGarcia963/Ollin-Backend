export class MuseoPlanController {
  constructor (Modelos) {
    this.museoPlanModel = Modelos.MuseoPlanModel
    this.museoModel = Modelos.MuseoModel
  }

  obtenerLugaresPorItinerario = async (req, res) => {
    const lugaresItinerario = await this.museoPlanModel.obtenerLugaresPorItinerario(req.body.idPlan)
    res.json(lugaresItinerario)
  }

   obtenerLugarItinerarioPorIdMuseo = async (req, res) =>{
      const { id_Museo, id_Plan } = req.body
      const lugarItinerario = await this.museoPlanModel.obtenerLugarItinerarioPorIdMuseo({ entrada: { id_Museo, id_Plan } })
      
          if (lugarItinerario) return res.json(lugarItinerario)
  
     res.status(404).json({ message: 'Este Museo no está agregado a este itinerario' })
    }

  obtenerLugarItinerarioPorId = async (req, res) => {
    const { id } = req.params

    const lugarItinerario = await this.museoPlanModel.obtenerLugarItinerarioPorId(id)

    if (lugarItinerario) return res.json(lugarItinerario)

    res.status(404).json({ message: 'No se encontró un lugar con ese ID en el itinerario' })
  }

  obtenerPrimerLugarItinerarioSinVisitar = async (req, res) => {
    const lugaresItinerario = await this.museoPlanModel.obtenerPrimerLugarItinerarioSinVisitar(req.body.id_Itinerario)
    res.json(lugaresItinerario)
  }

  crearLugarItinerario = async (req, res) => {
    const { id_Museo, Nombre, id_Plan, MetodoTransporte } = req.body
    console.log(req.body)
    const existeLugarItinerario = await this.museoPlanModel.obtenerLugarItinerarioPorIdMuseo({ entrada: { id_Museo, id_Plan } })
   
   if(existeLugarItinerario)
   {
    const resultado = await this.museoPlanModel.eliminarLugarItinerario(existeLugarItinerario.id_Plan_Museo)
    return res.json(resultado)
  }

    let existeLugar = await this.museoModel.obtenerLugarPorId(id_Museo)

    if (!existeLugar) {
      existeLugar = await this.museoModel.crearLugar({ entrada: { id_Museo, Nombre } })
    }
    
    const nuevoItinerario = await this.museoPlanModel.crearLugarItinerario({ entrada: {id_Museo, id_Plan, MetodoTransporte}})

    res.send(nuevoItinerario)
  }

  eliminarLugarItinerario = async (req, res) => {
    const resultado = await this.museoPlanModel.eliminarLugarItinerario(req.body.id_Lugar_Itinerario)

    res.status(200).json({ message: `${resultado}` })
  }

  editarLugarItinerario = async (req, res) => {
    const resultado = await this.museoPlanModel.editarLugarItinerario({ entrada: req.body })

    res.status(200).json({ message: `${resultado}` })
  }

  editarEstadoLugarItinerario = async (req, res) => {
    const resultado = await this.museoPlanModel.editarEstadoLugarItinerario({ entrada: req.body })

    res.status(200).json({ message: `${resultado}` })
  }
}
