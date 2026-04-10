// UpdateUsuarioController.js
export class UpdateUsuarioController {
    constructor(Modelos) {
        this.UpdateUsuarioModel = Modelos.UpdateUsuarioModel;
    }


    actualizarFechaNacimiento = async (req, res) => {
        try {
            const { id } = req.params;
            const { Fecha_Nacimiento } = req.body;
            await this.UpdateUsuarioModel.actualizarFechaNacimiento({ id, Fecha_Nacimiento });
            res.status(200).json({ message: 'Fecha de nacimiento actualizada con éxito' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la fecha de nacimiento', error: error.message });
        }
    }
}
