export class MuseoController {
  constructor(Modelos) {
    this.museoModel = Modelos.MuseoModel;
  }

  obtenerTodosLosLugares = async (req, res) => {
    try {
      const lugares = await this.museoModel.obtenerTodosLosLugares();
      res.json(lugares);
    } catch (error) {
      console.error("Error al obtener todos los lugares:", error);
      res.status(500).json({ message: "Error al obtener los lugares" });
    }
  };

  obtenerLugarPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const lugar = await this.museoModel.obtenerLugarPorId(id);

      if (lugar) return res.json(lugar);

      res.status(404).json({ message: "museo no encontrado" });
    } catch (error) {
      console.error("Error al obtener lugar por id:", error);
      res.status(500).json({ message: "Error al obtener el lugar" });
    }
  };

  crearLugar = async (req, res) => {
    try {
      const nuevoLugar = await this.museoModel.crearLugar({ entrada: req.body });
      res.send(nuevoLugar);
    } catch (error) {
      console.error("Error al crear lugar:", error);
      res.status(500).json({ message: "Error al crear el lugar" });
    }
  };

  obtenerEstadoUsuarioPorMuseos = async (req, res) => {
    try {
      const { id_Turista, ids_Museos } = req.body;

      if (!id_Turista) {
        return res.status(400).json({ message: "id_Turista es requerido" });
      }

      if (!Array.isArray(ids_Museos) || ids_Museos.length === 0) {
        return res.json([]);
      }

      const estados = await this.museoModel.obtenerEstadoUsuarioPorMuseos({
        id_Turista,
        ids_Museos
      });

      return res.json(estados);
    } catch (error) {
      console.error("Error al obtener estados de museos:", error);
      return res.status(500).json({ message: "Error al obtener estados de museos" });
    }
  };
}