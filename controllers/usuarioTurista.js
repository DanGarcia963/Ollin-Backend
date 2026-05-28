export class UsuarioTuristaController {
  constructor (Modelos) {
    this.usuarioTuristaModel = Modelos.UsuarioTuristaModel
  }

  obtenerTodosLosUsuarios = async (req, res) => {
    const { nombre = '', estado = '' } = req.query
    const usuariosTuristas = await this.usuarioTuristaModel.obtenerTodosLosUsuarios({ nombre, estado })
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

  validarCuenta = async (req, res) => {
    const usuarioEditado = await this.usuarioTuristaModel.validarCuenta({ entrada: req.body })

    if (typeof usuarioEditado === 'string') {
      return res.status(400).json({ status: 400, error: usuarioEditado })
    }

    res.status(200).send({ status: 200, message: `Usuario ${usuarioEditado.Nombre} validado con éxito` })
  }

  cambiarContraseña = async (req, res) => {
    const usuarioEditado = await this.usuarioTuristaModel.cambiarContraseña({ entrada: req.body })

    if (typeof usuarioEditado === 'string') {
      return res.status(400).json({ status: 400, error: usuarioEditado });
    }

    res.status(200).json({ status: 200, message: `Usuario ${usuarioEditado.Nombre} editado con éxito` });
  }

actualizarNombre = async (req, res) => {
  const updateName = await this.usuarioTuristaModel.actualizarNombre({ entrada: req.body });

  if (typeof updateName === 'string') {
    return res.status(400).json({ error: updateName });
  }

  res.status(200).json({ message: `Usuario ${updateName.Nombre} actualizado con éxito` });
}

  actualizarApellido = async (req, res) => {
    const updateLastName = await this.usuarioTuristaModel.actualizarApellido({ entrada: req.body })
    if (typeof updateLastName === 'string') {
      return res.status(400).json({ error: updateLastName })
    }
    res.status(200).json({ message: `Usuario ${updateLastName.Nombre} actualizado con éxito` })
  }

  actualizarCorreo = async (req, res) => {
    const updateEmail = await this.usuarioTuristaModel.actualizarCorreo({ entrada: req.body })
    if (typeof updateEmail === 'string') {
      return res.status(400).json({ error: updateEmail })
    }
    res.status(200).json({ message: `Usuario ${updateEmail.Nombre} actualizado con éxito` })
  }
}