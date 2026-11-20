import { SUPABASE_URL, SUPABASE_KEY } from '../../helpers/supabaseConfig.js'

const headers = {
  "apikey": SUPABASE_KEY,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class UpdateUsuarioModel {
    
  static async actualizarFechaNacimiento({ id, Fecha_Nacimiento }) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/usuario_turista?id=eq.${id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            Fecha_Nacimiento
          })
        }
      );

      if (!res.ok) {
        throw new Error('No se pudo actualizar la fecha de nacimiento');
      }

    } catch (error) {
      throw new Error('Error al actualizar la fecha de nacimiento: ' + error.message);
    }
  }
}