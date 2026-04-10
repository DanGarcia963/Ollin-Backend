export class UsuarioAdminController {
    constructor (Modelos) {
      this.usuarioAdminModel = Modelos.UsuarioAdminModel
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

    obtenerTodosLosAdmins = async (req, res) => {
      const usuariosAdmins = await this.usuarioAdminModel.obtenerTodosLosAdmins()
      res.json(usuariosAdmins)
    }
  
    obtenerUsuarioAdminPorCorreo = async (req, res) => {
      const { Correo } = req.params
  
      const usuarioAdmin = await this.usuarioAdminModel.obtenerUsuarioAdminPorCorreo(Correo)
  
      if (usuarioAdmin) return res.json(usuarioAdmin)
  
      res.status(404).json({ message: 'Usuario admin no encontrado' })
    }
  
    obtenerUsuarioAdminPorId = async (req, res) => {
      const { id } = req.params
  
      const usuarioAdminid = await this.usuarioAdminModel.obtenerUsuarioAdminPorId(id)
  
      if (usuarioAdminid) return res.json(usuarioAdminid)
  
      res.status(404).json({ message: 'Usuario admin no encontrado' })
    }
    
    cambiarContraseña = async (req, res) => {
      const usuarioEditado = await this.usuarioAdminModel.cambiarContraseña({ entrada: req.body })
  
      if (typeof usuarioEditado === 'string') {
        return res.send({ status: 401, error: usuarioEditado })
      }
  
      res.send({ status: 201, message: `Usuario ${usuarioEditado.Nombre} editado con éxito` })
    }

      actualizarNombre = async (req, res) => {
    const updateName = await this.usuarioAdminModel.actualizarNombre({ entrada: req.body });
    if (typeof updateName === 'string') {
        return res.send({ status: 401, error: updateName });
    }
    res.send({status:201, message: `Usuario ${updateName.Nombre} actualizado con éxito` });
}

actualizarApellido = async (req, res) => {
  const updateLastName = await this.usuarioAdminModel.actualizarApellido({ entrada: req.body });
  if (typeof updateLastName === 'string') {
      return res.send({ status: 401, error: updateLastName });
  }
  res.send({status:201, message: `Usuario ${updateLastName.Nombre} actualizado con éxito` });
}
  
  actualizarCorreo = async (req, res) => {
    const updateEmail = await this.usuarioAdminModel.actualizarCorreo({ entrada: req.body });
    if (typeof updateEmail === 'string') {
        return res.send({ status: 401, error: updateEmail });
    }
    res.send({status:201, message: `Usuario ${updateEmail.Nombre} actualizado con éxito` });
  }
  }
  