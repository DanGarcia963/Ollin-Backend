const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class MuseoModel {

  static async obtenerTodosLosLugares () {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/museo?Estado=eq.OP&select=*`,
      { headers }
    )

    const data = await res.json()

    if (!Array.isArray(data)) {
    console.error("❌ Error Supabase:", data)
    return []
  }

    return data.map(m => {
      const info = m.Informacion_JSON || {}

      const getHorario = (dia, tipo) =>
        info?.HorariosByDay?.[dia]?.[0]?.[tipo] ?? null

      const getTraduccion = (lang, key) =>
      info?.Traducciones?.[lang]?.Secciones?.[key] ?? null

      return {
        "ID MUSEO": m.id_Museo,
        NombreMuseo: m.Nombre,
        Municipio: info?.Municipio ?? null,

        HorarioIn_Lunes: getHorario("Lunes", "HorarioIn"),
        HorarioOut_Lunes: getHorario("Lunes", "HorarioOut"),
        HorarioIn_Martes: getHorario("Martes", "HorarioIn"),
        HorarioOut_Martes: getHorario("Martes", "HorarioOut"),
        HorarioIn_Miercoles: getHorario("Miércoles", "HorarioIn"),
        HorarioOut_Miercoles: getHorario("Miércoles", "HorarioOut"),
        HorarioIn_Jueves: getHorario("Jueves", "HorarioIn"),
        HorarioOut_Jueves: getHorario("Jueves", "HorarioOut"),
        HorarioIn_Viernes: getHorario("Viernes", "HorarioIn"),
        HorarioOut_Viernes: getHorario("Viernes", "HorarioOut"),
        HorarioIn_Sabado: getHorario("Sábado", "HorarioIn"),
        HorarioOut_Sabado: getHorario("Sábado", "HorarioOut"),
        HorarioIn_Domingo: getHorario("Domingo", "HorarioIn"),
        HorarioOut_Domingo: getHorario("Domingo", "HorarioOut"),

        OtrosHorarios: info?.HorariosOtros ?? null,

        EntradaGeneral: info?.CostosByLabel?.["Entrada general"] ?? null,
        AdmisionGeneral: info?.CostosByLabel?.["Admisión general"] ?? null,
        AbiertoPublico: info?.CostosByLabel?.["Abierto al público"] ?? null,
        EntradaLibre: info?.CostosByLabel?.["Entrada libre"] ?? null,
        EntradaGratuita: info?.CostosByLabel?.["Entrada gratuita"] ?? null,
        AccesoGratuito: info?.CostosByLabel?.["acceso es gratuito"] ?? null,
        EntradaesGratuita: info?.CostosByLabel?.["entrada es gratuita"] ?? null,
        Gratuita: info?.CostosByLabel?.["gratuita"] ?? null,
        Libre: info?.CostosByLabel?.["libre"] ?? null,

        OtrosCostos: info?.CostosOtros ?? null,

        DatosGenerales: info?.Secciones?.["Datos generales"] ?? null,
        SalasExhibicion: info?.Secciones?.["Salas de exhibición"] ?? null,
        SalasExhibicionTemporales: info?.Secciones?.["Salas de exhibición temporales"] ?? null,
        Servicios: info?.Secciones?.["Servicios"] ?? null,
        FechaFundacion: info?.Secciones?.["Fecha de fundación"] ?? null,

              // ==============================
      // TRADUCCIONES 🇺🇸 🇫🇷 🇮🇹
      // ==============================
        DatosGenerales_en: getTraduccion("en", "Datos generales"),
        DatosGenerales_fr: getTraduccion("fr", "Datos generales"),
        DatosGenerales_it: getTraduccion("it", "Datos generales"),

        SalasExhibicion_en: getTraduccion("en", "Salas de exhibición"),
        SalasExhibicion_fr: getTraduccion("fr", "Salas de exhibición"),
        SalasExhibicion_it: getTraduccion("it", "Salas de exhibición"),

        Servicios_en: getTraduccion("en", "Servicios"),
        Servicios_fr: getTraduccion("fr", "Servicios"),
        Servicios_it: getTraduccion("it", "Servicios"),

        FechaFundacion_en: getTraduccion("en", "Fecha de fundación"),
        FechaFundacion_fr: getTraduccion("fr", "Fecha de fundación"),
        FechaFundacion_it: getTraduccion("it", "Fecha de fundación"),

        SalasExhibicionTemporales_en: getTraduccion("en", "Salas de exhibición temporales"),
        SalasExhibicionTemporales_fr: getTraduccion("fr", "Salas de exhibición temporales"),
        SalasExhibicionTemporales_it: getTraduccion("it", "Salas de exhibición temporales"),


        Latitud: m.Latitud,
        Longitud: m.Longitud
      }
    })
  }

  static async obtenerLugarPorId (idMuseo) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/museo?id_Museo=eq.${idMuseo}&select=*`,
      { headers }
    )

    const data = await res.json()

    if (data.length === 0) return false
    return data[0]
  }

  static async crearLugar ({ entrada }) {
    const { id_Museo: idMuseo, Nombre } = entrada

    const existeMuseo = await this.obtenerLugarPorId(idMuseo)

    if (existeMuseo !== false) return 'Ya existe un lugar con ese id'

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/museo`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
          },
          body: JSON.stringify({
            id_Museo: idMuseo,
            Nombre
          })
        }
      )

      return await this.obtenerLugarPorId(idMuseo)

    } catch (error) {
      throw new Error(error)
    }
  }
}