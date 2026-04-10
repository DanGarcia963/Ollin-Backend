export class UsuarioTuristaController {
  constructor (Modelos) {
    this.usuarioTuristaModel = Modelos.UsuarioTuristaModel
  }

  obtenerTodosLosUsuarios = async (req, res) => {
    const usuariosTuristas = await this.usuarioTuristaModel.obtenerTodosLosUsuarios()
    res.json(usuariosTuristas)
  }

  obtenerUsuarioTuristaPorCorreo = async (req, res) => {
    const { Correo } = req.params

    const usuarioTurista = await this.usuarioTuristaModel.obtenerUsuarioTuristaPorCorreo(Correo)

    if (usuarioTurista) return res.json(usuarioTurista)

    res.status(404).json({ message: 'Usuario turista no encontrado' })
  }

  obtenerUsuarioTuristaPorId = async (req, res) => {
    const { id } = req.params

    const usuarioTuristaid = await this.usuarioTuristaModel.obtenerUsuarioTuristaPorId(id)

    if (usuarioTuristaid) return res.json(usuarioTuristaid)

    res.status(404).json({ message: 'Usuario turista no encontrado' })
  }
  
  cambiarContraseña = async (req, res) => {
    const usuarioEditado = await this.usuarioTuristaModel.cambiarContraseña({ entrada: req.body })

    if (typeof usuarioEditado === 'string') {
      return res.send({ status: 401, error: usuarioEditado })
    }

    res.send({ status: 201, message: `Usuario ${usuarioEditado.Nombre} editado con éxito` })
  }

  actualizarNombre = async (req, res) => {
    const updateName = await this.usuarioTuristaModel.actualizarNombre({ entrada: req.body });
    if (typeof updateName === 'string') {
        return res.send({ status: 401, error: updateName });
    }
    res.send({status:201, message: `Usuario ${updateName.Nombre} actualizado con éxito` });
}

actualizarApellido = async (req, res) => {
  const updateLastName = await this.usuarioTuristaModel.actualizarApellido({ entrada: req.body });
  if (typeof updateLastName === 'string') {
      return res.send({ status: 401, error: updateLastName });
  }
  res.send({status:201, message: `Usuario ${updateLastName.Nombre} actualizado con éxito` });
}

actualizarCorreo = async (req, res) => {
  const updateEmail = await this.usuarioTuristaModel.actualizarCorreo({ entrada: req.body });
  if (typeof updateEmail === 'string') {
      return res.send({ status: 401, error: updateEmail });
  }
  res.send({status:201, message: `Usuario ${updateEmail.Nombre} actualizado con éxito` });
}
}
