import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async () => {
  const client = useServerSupabase('barangay_directory')

  const { data, error } = await client
    .schema('barangay_directory')
    .from('position')
    .select('*')
    .order('rank_order', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch positions: ${error.message}`
    })
  }

  return data
})