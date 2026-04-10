const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class PlanModel {

static async obtenerItinerariosPorTurista (idTurista) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/plan_visita?id_Turista=eq.${idTurista}&Estado=neq.F&select=id_Plan,Nombre,Duracion,fecha_Creacion,Estado,usuario_turista(Nombre)`,
    { headers }
  )

  const data = await res.json()

  console.log("🔍 DATA PLAN:", data)

  if (!Array.isArray(data)) {
    console.error("❌ Error Supabase:", data)
    return []
  }

  return data.map(p => ({
    ID: p.id_Plan,
    Turista: p.usuario_turista?.Nombre ?? null,
    Nombre: p.Nombre,
    Duracion: p.Duracion,
    fecha_Creacion: p.fecha_Creacion,
    Estado: p.Estado
  }))
}

static async obtenerItinerariosFinalizados (idTurista) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/plan_visita?id_Turista=eq.${idTurista}&Estado=eq.F&select=id_Plan,Nombre,Duracion,fecha_Creacion,Estado,usuario_turista(Nombre)`,
    { headers }
  )

  const data = await res.json()

  // 🔍 Debug
  console.log("Respuesta Supabase:", data)

  if (!Array.isArray(data)) {
    console.error("Error: data no es un array", data)
    return []
  }

  return data.map(p => ({
    ID: p.id_Plan,
    Turista: p.usuario_turista?.Nombre,
    Nombre: p.Nombre,
    Duracion: p.Duracion,
    fecha_Creacion: p.fecha_Creacion,
    Estado: p.Estado
  }))
}

  static async obtenerItinerarioPorId (idPlan) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/plan_visita?id_Plan=eq.${idPlan}&select=*`,
      { headers }
    )

    const data = await res.json()

    if (data.length === 0) return false
    return data[0]
  }

  static async crearItinerario ({ entrada }) {
    const { id_Turista: idTurista, Nombre } = entrada

    try {
      const resCheck = await fetch(
        `${SUPABASE_URL}/rest/v1/plan_visita?id_Turista=eq.${idTurista}&Nombre=eq.${encodeURIComponent(Nombre)}&select=id_Plan`,
        { headers }
      )

      const planesExistentes = await resCheck.json()

      if (planesExistentes.length > 0) {
        return {
          mensaje: 'El plan ya existía, se reutilizó.',
          id_Plan: planesExistentes[0].id_Plan
        }
      }

      const resInsert = await fetch(
        `${SUPABASE_URL}/rest/v1/plan_visita`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            id_Turista: idTurista,
            Nombre
          })
        }
      )

      const dataInsert = await resInsert.json()

      return {
        mensaje: 'Plan de Visita creado con éxito',
        id_Plan: dataInsert[0].id_Plan
      }

    } catch (error) {
      throw new Error(error)
    }
  }

  static async eliminarItinerario (idPlan) {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/plan_visita?id_Plan=eq.${idPlan}`,
        {
          method: "DELETE",
          headers
        }
      )
    } catch (error) {
      throw new Error(error)
    }

    return 'Plan de Visita eliminado con éxito'
  }

  static async editarEstadoItinerario ({ entrada }) {
    const { id_Plan: idPlan, Estado } = entrada

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/plan_visita?id_Plan=eq.${idPlan}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Estado })
        }
      )
    } catch (error) {
      throw new Error(error)
    }

    return 'Estado del Plan de Visita actualizado con éxito'
  }
}