const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class MuseoFavoritoModel {

static async obtenerTodosLosLugaresFavoritos (idTurista) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/museo_favorito?id_Turista=eq.${idTurista}&select=
      id_Museo_Favorito,
      museo(
        id_Museo,
        Nombre,
        Latitud,
        Longitud,
        Informacion_JSON
      )`,
    { headers }
  )

  const data = await res.json()

  if (!Array.isArray(data)) {
    console.error("❌ Error Supabase:", data)
    return []
  }

  return data.map(m => {
    const info = m.museo?.Informacion_JSON || {}

    return {
      id_Museo_Favorito: m.id_Museo_Favorito,
      "ID MUSEO": m.museo?.id_Museo,
      NombreMuseo: m.museo?.Nombre,

      // 🔥 nuevos datos (los que antes pedías a Maps)
      Latitud: m.museo?.Latitud,
      Longitud: m.museo?.Longitud,

      Direccion: info.Direccion,
      Rating: info.Rating,
      Telefono: info.Telefono,
      Imagenes: info.Imagenes,

      Horarios: info.HorariosByDay,
      Costos: info.CostosByLabel,

      Informacion_JSON: info
    }
  })
}

  static async obtenerLugarFavoritoPorId (idMuseoFavorito) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/museo_favorito?id_Museo_Favorito=eq.${idMuseoFavorito}&select=id_Museo_Favorito,id_Museo,id_Turista`,
      { headers }
    )

    const data = await res.json()

    if (data.length === 0) return false
    return data[0]
  }

  static async obtenerLugarFavoritoPorIdLugarDeUnTurista ({ entrada }) {
    const { id_Museo: idMuseo, id_Turista: idTurista } = entrada

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/museo_favorito?id_Museo=eq.${idMuseo}&id_Turista=eq.${idTurista}&select=id_Museo_Favorito,id_Museo,id_Turista`,
      { headers }
    )

    const data = await res.json()

    if (data.length === 0) return false
    return data[0]
  }

  static async crearLugarFavorito ({ entrada }) {
    const { id_Museo: idMuseo, id_Turista: idTurista } = entrada

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/museo_favorito`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            id_Museo: idMuseo,
            id_Turista: idTurista
          })
        }
      )
    } catch (error) {
      throw new Error(error)
    }

    return 'Museo favorito creado con éxito'
  }

  static async eliminarLugarFavorito (idMuseoFavorito) {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/museo_favorito?id_Museo_Favorito=eq.${idMuseoFavorito}`,
        {
          method: "DELETE",
          headers
        }
      )
    } catch (error) {
      throw new Error(error)
    }

    return 'Museo favorito eliminado con éxito'
  }
}