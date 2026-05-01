const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class MuseoVisitadoModel {

  static async obtenerTodosLosLugaresVisitados(idTurista) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/museo_visitado?id_Turista=eq.${idTurista}&select=id_Museo_Visitado,id_Museo,id_Turista,museo(id_Museo,Nombre,Latitud,Longitud,Informacion_JSON)`,
      { headers }
    );

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("❌ Error Supabase:", data);
      return [];
    }

    console.log("Respuesta visitados:", data);

    return data.map(m => {
      const info = m.museo?.Informacion_JSON || {};

      return {
        id_Museo_Visitado: m.id_Museo_Visitado,
        "ID MUSEO": m.museo?.id_Museo ?? m.id_Museo ?? null,
        NombreMuseo: m.museo?.Nombre ?? null,

        Latitud: m.museo?.Latitud ?? null,
        Longitud: m.museo?.Longitud ?? null,

        Direccion: info.Direccion ?? null,
        Rating: info.Rating ?? null,
        Telefono: info.Telefono ?? null,
        Imagenes: info.Imagenes ?? [],

        Horarios: info.HorariosByDay ?? null,
        Costos: info.CostosByLabel ?? null,

        Informacion_JSON: info
      };
    });
  }

  static async obtenerLugarVisitadoPorId(idMuseoVisitado) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/museo_visitado?id_Museo_Visitado=eq.${idMuseoVisitado}&select=id_Museo_Visitado,id_Museo,id_Turista`,
      { headers }
    );

    const data = await res.json();

    if (data.length === 0) return false;
    return data[0];
  }

  static async obtenerLugarVisitadoPorIdLugarDeUnTurista({ entrada }) {
    const { id_Museo: idMuseo, id_Turista: idTurista } = entrada;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/museo_visitado?id_Museo=eq.${idMuseo}&id_Turista=eq.${idTurista}&select=id_Museo_Visitado,id_Museo,id_Turista`,
      { headers }
    );

    const data = await res.json();

    if (data.length === 0) return false;
    return data[0];
  }

  static async crearLugarVisitado({ entrada }) {
    const { id_Museo: idMuseo, id_Turista: idTurista } = entrada;

    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/museo_visitado`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            id_Museo: idMuseo,
            id_Turista: idTurista
          })
        }
      );
    } catch (error) {
      throw new Error(error);
    }

    return 'Museo visitado marcado con éxito';
  }

  static async eliminarLugarVisitado(idMuseoVisitado) {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/museo_visitado?id_Museo_Visitado=eq.${idMuseoVisitado}`,
        {
          method: "DELETE",
          headers
        }
      );
    } catch (error) {
      throw new Error(error);
    }

    return 'Museo visitado eliminado con éxito';
  }

  static async obtenerNumMuseoMes(idTurista) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/museo_visitado?id_Turista=eq.${idTurista}&select=id_Museo,Fecha_Visitado`,
      { headers }
    );

    const data = await res.json();
    const now = new Date();

    const filtrados = data.filter(m => {
      const fecha = new Date(m.Fecha_Visitado);
      return fecha.getMonth() === now.getMonth() &&
             fecha.getFullYear() === now.getFullYear();
    });

    const unicos = new Set(filtrados.map(m => m.id_Museo));

    return unicos.size;
  }

  static async obtenerNumMuseoAno(idTurista) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/museo_visitado?id_Turista=eq.${idTurista}&select=id_Museo,Fecha_Visitado`,
      { headers }
    );

    const data = await res.json();
    const now = new Date();

    const filtrados = data.filter(m => {
      const fecha = new Date(m.Fecha_Visitado);
      return fecha.getFullYear() === now.getFullYear();
    });

    const unicos = new Set(filtrados.map(m => m.id_Museo));

    return unicos.size;
  }

static async recomendarMuseos() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/museo_visitado?select=id_Museo,museo(id_Museo,Nombre,Latitud,Longitud,Informacion_JSON)`,
    { headers }
  );

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("❌ Error Supabase:", data);
    return [];
  }

  const conteo = {};

  data.forEach(m => {
    const id = m.id_Museo;
    const museo = m.museo || {};
    const info = museo.Informacion_JSON || {};

    if (!conteo[id]) {
      conteo[id] = {
        "ID MUSEO": museo.id_Museo ?? id ?? null,
        NombreMuseo: museo.Nombre ?? info?.Nombre ?? null,
        Municipio: info?.Municipio ?? null,
        Direccion: info?.Direccion ?? null,
        Rating: info?.Rating ?? null,
        Telefono: info?.Telefono ?? null,
        Imagenes: info?.Imagenes ?? [],
        Latitud: museo.Latitud ?? null,
        Longitud: museo.Longitud ?? null,
        HorariosByDay: info?.HorariosByDay ?? null,
        CostosByLabel: info?.CostosByLabel ?? null,
        Secciones: info?.Secciones ?? null,
        total_visitas: 0
      };
    }

    conteo[id].total_visitas++;
  });

  return Object.values(conteo)
    .sort((a, b) => b.total_visitas - a.total_visitas)
    .slice(0, 5);
}
}