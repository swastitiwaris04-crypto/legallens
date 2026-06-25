import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY

export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null

export function createClient() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Set SUPABASE_SECRET_KEY in .env.local')
  }
  return supabaseAdmin
}

export function requireAdmin() {
  return createClient()
}
