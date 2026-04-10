const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

import dotenv from 'dotenv'
import { enviarEmailCambioEstadoMuseo, enviarEmailCambioEstadoMuseoPlan } from '../../services/mail.service.js'
import { generarTokenParaCorreo } from '../../helpers/token.js'
import jsonwebtoken from 'jsonwebtoken'

dotenv.config()

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class QuejaModel {

static async obtenerMuseosConSinQuejas (){
  const fechaHaceUnMes = new Date()
  fechaHaceUnMes.setMonth(fechaHaceUnMes.getMonth() - 1)

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/museo?select=*,queja(id_Queja,Tipo_Queja,fecha)`,
    { headers }
  )

  const data = await res.json()

  return data
    .map(m => {
      const info = m.Informacion_JSON || {}
      const getHorario = (dia, tipo) =>
        info?.HorariosByDay?.[dia]?.[0]?.[tipo] ?? null
      const quejas = (m.queja || []).filter(q => 
        new Date(q.fecha) >= fechaHaceUnMes
      )

      return {
        "ID MUSEO": m.id_Museo,
        NombreMuseo: m.Nombre,
        tiene_quejas: quejas.length > 0,
        total_quejas_ultimo_mes: quejas.length,
        Tipo_Queja: quejas.map(q => q.Tipo_Queja),
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

        Latitud: m.Latitud,
        Longitud: m.Longitud
      }
    })
    .sort((a, b) => b.total_quejas_ultimo_mes - a.total_quejas_ultimo_mes)
}

  obtenerNumQuejasPorMuseo = async (id_Museo) => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/queja?id_Museo=eq.${id_Museo}&select=id_Queja`,
      { headers }
    )

    const data = await res.json()

    return { num_quejas: data.length }
  }

static async crearQueja ({ entrada }) {
  const { Tipo_Queja: tipoQueja, id_Museo: idMuseo } = entrada

  const date = new Date().toISOString();

  try {
    // =========================
    // 1. CREAR QUEJA
    // =========================
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/queja`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          Tipo_Queja: tipoQueja,
          id_Museo: idMuseo,
          fecha: date
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData)
    }

    const data = await response.json()

    // =========================
    // 2. CONTAR QUEJAS (7 días)
    // =========================
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const resQuejas = await fetch(
      `${SUPABASE_URL}/rest/v1/queja?id_Museo=eq.${idMuseo}&fecha=gte.${oneWeekAgo.toISOString()}`,
      { headers }
    )

    const quejas = await resQuejas.json()

    // =========================
    // 3. OBTENER ESTADO ACTUAL
    // =========================
    const resMuseo = await fetch(
      `${SUPABASE_URL}/rest/v1/museo?id_Museo=eq.${idMuseo}&select=Estado,Nombre`,
      { headers }
    )

    const museo = (await resMuseo.json())[0]

    // =========================
    // 4. SI >= 3 → CERRAR + EMAIL
    // =========================
    if (quejas.length >= 3 && museo.Estado !== 'CT') {

      // 🔒 Cambiar estado
      await fetch(
        `${SUPABASE_URL}/rest/v1/museo?id_Museo=eq.${idMuseo}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            Estado: 'CT',
            fecha_cambio_estado: new Date().toISOString()
          })
        }
      )

      // =========================
      // 📧 ENVIAR CORREOS
      // =========================

const resUsuarios = await fetch(
  `${SUPABASE_URL}/rest/v1/usuario_turista?select=id,Correo,Nombre`,
  { headers }
)

const usuarios = await resUsuarios.json()
console.log("Usuarios registrados:", usuarios)
// =========================
// 👇 USUARIOS CON PLAN ACTIVO
// =========================

const resUsuariosConPlan = await fetch(
  `${SUPABASE_URL}/rest/v1/plan_visita?Estado=eq.N&select=id_Turista,Nombre,plan_museo(id_Museo)`,
  { headers }
)

const planes = await resUsuariosConPlan.json()
console.log("Planes de visita activos:", planes)
// Sacar IDs de usuarios que tienen ese museo
const usuariosConMuseo = new Map()

planes.forEach(plan => {
  plan.plan_museo?.forEach(mp => {
     console.log(`Aventura ${plan.Nombre} tiene el museo en su plan de visita y ${mp.id_Museo} = ${idMuseo}`)
    if (mp.id_Museo === idMuseo) {
      console.log(`Dentro aventura ${plan.Nombre} tiene el museo en su plan de visitay ${mp.id_Museo} = ${idMuseo}`)
      usuariosConMuseo.set(plan.id_Turista, plan.Nombre)
    }
  })
})

// =========================
// 📧 ENVIAR CORREOS
// =========================

await Promise.all(
  usuarios.map(usuario => {
    const token = generarTokenParaCorreo(usuario.Correo)

    // 🟢 Usuario tiene el museo en su plan
    if (usuariosConMuseo.has(usuario.id)) {
      const nombrePlan = usuariosConMuseo.get(usuario.id)

      return enviarEmailCambioEstadoMuseoPlan(
        usuario.Correo,
        usuario.Nombre,
        museo,
        nombrePlan,
        token
      )
    }

    // 🔵 Usuario normal
    return enviarEmailCambioEstadoMuseo(
      usuario.Correo,
      usuario.Nombre,
      museo,
      token
    )
  })
)
    }

    return data[0]

  } catch (error) {
    throw new Error(error)
  }
}
}