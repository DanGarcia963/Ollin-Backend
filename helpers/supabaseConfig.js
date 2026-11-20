// API REST de Ollin. Establecer la clave publicable en las variables de Railway.
const supabaseBaseUrl =
  process.env.SUPABASE_URL || 'https://ryulkebgdtiitpluexsv.supabase.co'

export const SUPABASE_URL = supabaseBaseUrl
  .trim()
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '')

export const SUPABASE_KEY = (process.env.SUPABASE_PUBLISHABLE_KEY || '').trim()

if (!SUPABASE_KEY) {
  console.warn('Ollin: falta SUPABASE_PUBLISHABLE_KEY en las variables de Railway')
}
