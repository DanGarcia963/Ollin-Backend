export class MuseoController {
  constructor (Modelos) {
    this.museoModel = Modelos.MuseoModel
  }

  obtenerTodosLosLugares = async (req, res) => {
    const lugares = await this.museoModel.obtenerTodosLosLugares()
    res.json(lugares)
  }

  obtenerLugarPorId = async (req, res) => {
    const { id } = req.params

    const lugar = await this.museoModel.obtenerLugarPorId(id)

    if (lugar) return res.json(lugar)

    res.status(404).json({ message: 'museo no encontrado' })
  }

  crearLugar = async (req, res) => {
    const nuevoLugar = await this.museoModel.crearLugar({ entrada: req.body })

    res.send(nuevoLugar)
  }
}
