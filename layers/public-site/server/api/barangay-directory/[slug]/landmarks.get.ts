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
    .from('barangay_landmark')
    .select('*')
    .eq('barangay_id', id)
    .order('name', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch landmarks: ${error.message}`
    })
  }

  return data
})