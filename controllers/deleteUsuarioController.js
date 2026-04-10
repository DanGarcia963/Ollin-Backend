export class DeleteUsuarioController {
    constructor (Modelos) {
      this.DeleteUsuarioModel = Modelos.DeleteUsuarioModel
    }

    borrarPorEmail = async (req, res) => {
        try {
            const { id } = req.params

            const delate = await this.DeleteUsuarioModel.borrarPorEmail(id); // Corrección aquí
            res.status(200).json({ message: 'Usuario borrado con éxito' });
        } catch (error) {
            res.status(500).json({ message: 'Error al borrar el usuario', error: error.message });
        }
    }
}
