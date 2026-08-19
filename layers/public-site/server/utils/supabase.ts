import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for server-side operations.
 * Uses service role key to bypass RLS.
 * A fresh client is created per call to avoid stale connections after db restarts.
 */
export function useServerSupabase(schema: string = 'governance'): SupabaseClient<any, any, any> {
  const config = useRuntimeConfig()

  let supabaseUrl = (
    config.supabaseUrl ||
    process.env.SUPABASE_URL ||
    'http://127.0.0.1:54321'
  ) as string

  // Studio port (54323) 
  if (supabaseUrl.includes(':54323')) {
    supabaseUrl = supabaseUrl.replace(':54323', ':54321')
  }

  const supabaseKey = (
    config.supabaseServiceRoleKey ||
    process.env.SUPABASE_SERVICE_ROLE_KEY
   
  ) as string

  return createClient(supabaseUrl, supabaseKey, {
    db: {
      schema: schema || 'governance',
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}