const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class MuseoPlanModel {

  static async obtenerLugaresPorItinerario (idPlan) {
const res = await fetch(
  `${SUPABASE_URL}/rest/v1/plan_museo?id_Plan=eq.${idPlan}&select=id_Plan_Museo,Posicion,MetodoTransporte,Estado,museo(id_Museo,Informacion_JSON),plan_visita(id_Plan,Nombre,fecha_Creacion)&order=Posicion.desc`,
  { headers }
)

    const data = await res.json()

    if (!res.ok) {
      console.error("❌ Error Supabase:", data)
      return []
    }

    if (!Array.isArray(data)) {
      console.error("❌ No es arreglo:", data)
      return []
    }

    const resultado = data.map(item => {
      const info = item.museo?.Informacion_JSON || {}

      const getHorario = (dia, tipo) =>
        info?.HorariosByDay?.[dia]?.[0]?.[tipo] || null

      return {
        ID: item.id_Plan_Museo,
        "ID Plan": item.plan_visita?.id_Plan,
        Plan: item.plan_visita?.Nombre,
        "Estado Museo": item.Estado,
        fechaCreacion: item.plan_visita?.fecha_Creacion,
        "ID MUSEO": item.museo?.id_Museo,
        "Posición en itinerario": item.Posicion,
        "Metodo de transporte": item.MetodoTransporte,

        HoraApertura_Lunes: getHorario("Lunes", "HorarioIn"),
        HoraCierre_Lunes: getHorario("Lunes", "HorarioOut"),
        HoraApertura_Martes: getHorario("Martes", "HorarioIn"),
        HoraCierre_Martes: getHorario("Martes", "HorarioOut"),
        HoraApertura_Miércoles: getHorario("Miércoles", "HorarioIn"),
        HoraCierre_Miércoles: getHorario("Miércoles", "HorarioOut"),
        HoraApertura_Jueves: getHorario("Jueves", "HorarioIn"),
        HoraCierre_Jueves: getHorario("Jueves", "HorarioOut"),
        HoraApertura_Viernes: getHorario("Viernes", "HorarioIn"),
        HoraCierre_Viernes: getHorario("Viernes", "HorarioOut"),
        HoraApertura_Sábado: getHorario("Sábado", "HorarioIn"),
        HoraCierre_Sábado: getHorario("Sábado", "HorarioOut"),
        HoraApertura_Domingo: getHorario("Domingo", "HorarioIn"),
        HoraCierre_Domingo: getHorario("Domingo", "HorarioOut")
      }
    })

    console.log(resultado)
    return resultado
  }

  static async obtenerLugarItinerarioPorIdMuseo ({ entrada }) {
    const { id_Museo: idMuseo, id_Plan: idPlan } = entrada

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/plan_museo?id_Plan=eq.${idPlan}&id_Museo=eq.${idMuseo}&select=*`,
      { headers }
    )

    const data = await res.json()

    if (data.length === 0) return false
    return data
  }

  static async obtenerLugarItinerarioPorId (idMuseoPlan) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/plan_museo?id_Plan_Museo=eq.${idMuseoPlan}&select=*`,
      { headers }
    )

    const data = await res.json()

    if (data.length === 0) return false
    return data[0]
  }

  static async obtenerPrimerLugarItinerarioSinVisitar (idPlan) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/plan_museo?id_Plan=eq.${idPlan}&Estado=eq.S&select=
        id_Plan_Museo,
        Posicion,
        MetodoTransporte,
        Estado,
        museo(id_Museo),
        plan_visita(Nombre)
      &order=Posicion.desc&limit=1`,
      { headers }
    )

    const data = await res.json()

    if (data.length === 0) return false

    const item = data[0]

    return {
      ID: item.id_Plan_Museo,
      Plan: item.plan_visita?.Nombre,
      "Estado Museo": item.Estado,
      "ID MUSEO": item.museo?.id_Museo,
      "Posición en itinerario": item.Posicion,
      "Metodo de transporte": item.MetodoTransporte
    }
  }

  static async crearLugarItinerario ({ entrada }) {
    const { id_Museo: idMuseo, id_Plan: idPlan, MetodoTransporte } = entrada

    try {
      // Obtener última posición
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/plan_museo?id_Plan=eq.${idPlan}&select=Posicion&order=Posicion.desc&limit=1`,
        { headers }
      )

      const data = await res.json()

      let establecerPosicion = 0
      if (data.length !== 0) {
        establecerPosicion = data[0].Posicion + 1
      }

      await fetch(
        `${SUPABASE_URL}/rest/v1/plan_museo`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            id_Museo: idMuseo,
            id_Plan: idPlan,
            MetodoTransporte,
            Posicion: establecerPosicion
          })
        }
      )

    } catch (error) {
      throw new Error(error)
    }

    return 'Museo en Plan creado con éxito'
  }

  static async eliminarLugarItinerario (idMuseoPlan) {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/plan_museo?id_Plan_Museo=eq.${idMuseoPlan}`,
        {
          method: "DELETE",
          headers
        }
      )
    } catch (error) {
      throw new Error(error)
    }

    return 'Museo en  Plan eliminado con éxito'
  }

  static async editarLugarItinerario ({ entrada }) {
    const { id_Plan_Museo: idMuseoPlan, MetodoTransporte, Posicion } = entrada

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/plan_museo?id_Plan_Museo=eq.${idMuseoPlan}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            Posicion,
            MetodoTransporte
          })
        }
      )
    } catch (error) {
      throw new Error(error)
    }

    return 'Museo en plan actualizado con éxito'
  }

  static async editarEstadoLugarItinerario ({ entrada }) {
    const { id_Plan_Museo: idMuseoPlan, Estado } = entrada

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/plan_museo?id_Plan_Museo=eq.${idMuseoPlan}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ Estado })
        }
      )
    } catch (error) {
      throw new Error(error)
    }

    return 'Estado del Museo en Plan actualizado con éxito'
  }
}