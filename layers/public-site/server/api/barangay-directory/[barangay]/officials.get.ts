import { useServerSupabase } from '../../../utils/supabase'
import { resolveTermId } from '../../../utils/barangayTerm'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const barangayId = getRouterParam(event, 'barangay')

  if (!barangayId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Barangay ID/slug is required.'
    })
  }

  // Scope officials to a term. An explicit ?term= wins; otherwise the current
  // term is used. When no terms exist at all, fall back to showing everything.
  const query = getQuery(event)
  const requestedTerm = (query.term || query.term_id || query.termId) as string | undefined
  const termId = await resolveTermId(client, requestedTerm)

  let officialsQuery = client
    .schema('barangay_directory')
    .from('v_elected_officials')
    .select('*')
    .eq('barangay_id', barangayId)

  if (termId) {
    officialsQuery = officialsQuery.eq('term_id', termId)
  }

  const { data, error } = await officialsQuery
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error(`Error fetching officials for '${barangayId}':`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch officials: ${error.message}`
    })
  }

  return data || []
})
