export class DeleteUsuarioController {
    constructor (Modelos) {
      this.DeleteUsuarioModel = Modelos.DeleteUsuarioModel
    }

borrarPorEmail = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Falta el id del usuario' });
    }

    await this.DeleteUsuarioModel.borrarPorEmail(id);

    return res.status(200).json({ message: 'Usuario borrado con éxito' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al borrar el usuario', error: error.message });
  }
}
}
