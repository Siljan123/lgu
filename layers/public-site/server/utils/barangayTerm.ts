import type { SupabaseClient } from '@supabase/supabase-js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUUID(str?: string | null): boolean {
  return !!str && UUID_RE.test(str)
}

/**
 * Resolves which term's officials to operate on.
 * Priority: an explicit, valid UUID -> the flagged current term -> the newest
 * term by start_date. Returns null only when no terms exist at all (in which
 * case callers should fall back to their pre-term behaviour).
 */
export async function resolveTermId(
  client: SupabaseClient<any, any, any>,
  requested?: string | null
): Promise<string | null> {
  if (isUUID(requested)) return requested as string

  const { data } = await client
    .schema('barangay_directory')
    .from('term')
    .select('id, is_current, start_date')
    .order('is_current', { ascending: false })
    .order('start_date', { ascending: false })
    .limit(1)

  return data && data.length > 0 ? data[0]!.id : null
}
