import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for server-side operations.
 * Uses service role key to bypass RLS.
 * A fresh client is created per call to avoid stale connections after db restarts.
 */
export function useServerSupabase(): SupabaseClient {
  const config = useRuntimeConfig()

  let supabaseUrl = (
    config.supabaseUrl ||
    process.env.SUPABASE_URL ||
    'http://127.0.0.1:54321'
  ) as string

  // Studio port (54323) is a Next.js UI, not the Supabase API Gateway (54321)
  if (supabaseUrl.includes(':54323')) {
    supabaseUrl = supabaseUrl.replace(':54323', ':54321')
  }

  const supabaseKey = (
    config.supabaseServiceRoleKey ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
  ) as string

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
