import { useServerSupabase } from '../../../utils/supabase'
import { resolveTermId } from '../../../utils/barangayTerm'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const barangayName = getRouterParam(event, 'barangay')

  if (!barangayName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Barangay IDis required.'
    })
  }

  // Resolve the term to show: explicit ?term= wins, else the current term.
  const query = getQuery(event)
  const requestedTerm = (query.term || query.term_id || query.termId) as string | undefined
  const termId = await resolveTermId(client, requestedTerm)

  const fetchBarangayDetails = async (schemaName: string) => {
    const { data: barangay, error: bError } = await client
      .schema(schemaName)
      .from('barangay')
      .select('*')
      .eq('id', barangayName)
      .maybeSingle()

    if (bError) return { error: bError, data: null }
    if (!barangay) return { error: null, data: null }

    let officialsQuery = client
      .schema(schemaName)
      .from('v_elected_officials')
      .select('*')
      .eq('barangay_id', barangayName)

    // Term scoping only applies to the barangay_directory schema (the only one
    // that carries term_id); fallback schemas are returned unfiltered.
    if (schemaName === 'barangay_directory' && termId) {
      officialsQuery = officialsQuery.eq('term_id', termId)
    }

    const { data: officials } = await officialsQuery
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    return {
      error: null,
      data: {
        ...barangay,
        officials: officials || [],
        term_id: termId
      }
    }
  }

  let { data, error } = await fetchBarangayDetails('barangay_directory')

  if (error && error.message?.includes('Invalid schema')) {
    const govResult = await fetchBarangayDetails('governance')
    if (!govResult.error && govResult.data) {
      data = govResult.data
      error = null
    } else {
      const pubResult = await fetchBarangayDetails('public')
      if (!pubResult.error && pubResult.data) {
        data = pubResult.data
        error = null
      }
    }
  }

  if (error) {
    console.error(`Error fetching barangay '${barangayName}' from Supabase:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch barangay: ${error.message}`
    })
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: `Barangay '${barangayName}' not found.`
    })
  }

  return data
})
