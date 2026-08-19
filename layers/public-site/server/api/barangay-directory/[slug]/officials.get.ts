import { useServerSupabase } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const id = getRouterParam(event, 'slug')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Barangay ID/slug is required.'
    })
  }

  const { data, error } = await client
    .schema('barangay_directory')
    .from('v_elected_officials')
    .select('*')
    .eq('barangay_id', id)
    .order('order_index', { ascending: true })

  if (error) {
    console.error(`Error fetching officials for '${id}':`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch officials: ${error.message}`
    })
  }

  return data || []
})