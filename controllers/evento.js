export class EventoController {
  constructor (Modelos) {
    this.eventoModel = new Modelos.EventoModel
  }

  obtenerDescripcionEvento = async (req, res) => {
    const eventos = await this.eventoModel.obtenerDescripcionEvento();
    res.json(eventos);
  }

  obtenerMuseosPorEvento = async (req, res) => {
    const eventos = await this.eventoModel.obtenerMuseosPorEvento(req.body.id_Evento);
    res.json(eventos);
  }

  obtenerEventosConMuseos = async (req, res) => {
    const eventos = await this.eventoModel.obtenerEventosConMuseos();
    res.json(eventos);
  }
}