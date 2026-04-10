const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class EventoModel {

  obtenerDescripcionEvento = async () => {
    const hoy = new Date().toISOString().split('T')[0]

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/evento_nightmuseums?Fecha_Inicio=gte.${hoy}&select=id_Evento,Descripcion,Fecha_Inicio,Fecha_Limite&order=Fecha_Inicio.asc`,
      { headers }
    )

    const data = await res.json()
    return data
  }

  obtenerMuseosPorEvento = async (id_Evento) => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/evento_museo?id_Evento=eq.${id_Evento}&select=museo(id_Museo,Nombre)`,
      { headers }
    )

    const data = await res.json()

    return data.map(m => ({
      id_Museo: m.museo?.id_Museo,
      Nombre: m.museo?.Nombre
    }))
  }

  obtenerEventosConMuseos = async () => {
    const hoy = new Date().toISOString().split('T')[0]

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/evento_nightmuseums?Fecha_Inicio=gte.${hoy}&select=
        id_Evento,
        Descripcion,
        Fecha_Inicio,
        Fecha_Limite,
        evento_museo(
          museo(id_Museo,Nombre)
        )
      &order=Fecha_Inicio.asc`,
      { headers }
    )

    const data = await res.json()

    // reconstruir resultado plano como tu SQL
    const resultado = []

    data.forEach(evento => {
      if (!evento.evento_museo || evento.evento_museo.length === 0) {
        resultado.push({
          id_Evento: evento.id_Evento,
          Descripcion: evento.Descripcion,
          Fecha_Inicio: evento.Fecha_Inicio,
          Fecha_Limite: evento.Fecha_Limite,
          id_Museo: null,
          NombreMuseo: null
        })
      } else {
        evento.evento_museo.forEach(em => {
          resultado.push({
            id_Evento: evento.id_Evento,
            Descripcion: evento.Descripcion,
            Fecha_Inicio: evento.Fecha_Inicio,
            Fecha_Limite: evento.Fecha_Limite,
            id_Museo: em.museo?.id_Museo,
            NombreMuseo: em.museo?.Nombre
          })
        })
      }
    })

    return resultado
  }
}