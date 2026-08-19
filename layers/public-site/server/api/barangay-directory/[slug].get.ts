import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const id = getRouterParam(event, 'slug')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Barangay ID/slug is required.'
    })
  }

  const fetchBarangayDetails = async (schemaName: string) => {
    const { data: barangay, error: bError } = await client
      .schema(schemaName)
      .from('barangay')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (bError) return { error: bError, data: null }
    if (!barangay) return { error: null, data: null }

    const { data: officials } = await client
      .schema(schemaName)
      .from('v_elected_officials')
      .select('*')
      .eq('barangay_id', id)
      .order('order_index', { ascending: true })

    const { data: landmarks } = await client
      .schema(schemaName)
      .from('barangay_landmark')
      .select('*')
      .eq('barangay_id', id)

    return {
      error: null,
      data: {
        ...barangay,
        officials: officials || [],
        landmarks: landmarks || []
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
    console.error(`Error fetching barangay '${id}' from Supabase:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch barangay: ${error.message}`
    })
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: `Barangay '${id}' not found.`
    })
  }

  return data
})