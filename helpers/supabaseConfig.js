// Valores por defecto para conservar compatibilidad con el proyecto original.
// En Railway, SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY tienen prioridad.
export const SUPABASE_URL = (
  process.env.SUPABASE_URL || 'https://fugjkxnxfsnnnhnshxzg.supabase.co'
).replace(/\/$/, '')

export const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R'
