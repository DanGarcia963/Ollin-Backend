export class PlanVisitaController {
  constructor (Modelos) {
    this.planModel = Modelos.PlanModel
  }

  obtenerItinerariosPorTurista = async (req, res) => {
    const itinerarios = await this.planModel.obtenerItinerariosPorTurista(req.body.id_Turista)
    res.json(itinerarios)
  }

  obtenerItinerariosFinalizados = async (req, res) => {
    const itinerarios = await this.planModel.obtenerItinerariosFinalizados(req.body.id_Turista)
    res.json(itinerarios)
  }

  obtenerItinerarioPorId = async (req, res) => {
    const { id } = req.params

    const itinerario = await this.planModel.obtenerItinerarioPorId(id)

    if (itinerario) return res.json(itinerario)

    res.status(404).json({ message: 'plan de visita no encontrado' })
  }

  crearItinerario = async (req, res) => { 
    try{
      const nuevoItinerario = await this.planModel.crearItinerario({ entrada: req.body })
      res.status(201).json(nuevoItinerario);
    }
    catch(error) 
    {
      res.status(500).json({ error: 'Error al crear el plan de visita' });
    }
  };

  eliminarItinerario = async (req, res) => {
    const resultado = await this.planModel.eliminarItinerario(req.body.id_Itinerario)

    res.status(200).json({ message: `${resultado}` })
  }
  
  editarEstadoItinerario = async (req, res) => {
    const resultado = await this.planModel.editarEstadoItinerario({ entrada: req.body })

    res.status(200).json({ message: `${resultado}` })
  }
}
