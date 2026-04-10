export class QuejaController {
  constructor (Modelos) {
    this.quejaModel = Modelos.QuejaModel
  }

  obtenerMuseosConSinQuejas = async (req, res) => {
    const quejas = await this.quejaModel.obtenerMuseosConSinQuejas()
    res.json(quejas)
  }

  obtenerNumQuejasPorMuseo = async (req, res) => {
    const numqueja = await this.quejaModel.obtenerNumQuejasPorMuseo(req.body.id_Museo)

    if (numqueja) return res.json(numqueja)

    res.status(404).json({ message: 'No hay quejas para este museo' })
  }

  crearQueja = async (req, res) => {
  const { entrada } = req.body

  const queja = await this.quejaModel.crearQueja({ entrada })

  res.send({ mensaje: queja })
}
}
