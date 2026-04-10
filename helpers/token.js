import jsonwebtoken from 'jsonwebtoken'

export const generarTokenParaCorreo = (valor) => {
  const valoresToken = {}
  valoresToken.Correo = valor

  const token = jsonwebtoken.sign(
    valoresToken,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION })

  return token
}
