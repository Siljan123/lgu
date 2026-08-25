import { useServerSupabase } from '../../../utils/supabase'

// Lists every shared term, current term first, then newest by start date.
export default defineEventHandler(async () => {
  const client = useServerSupabase('barangay_directory')

  const { data, error } = await client
    .schema('barangay_directory')
    .from('term')
    .select('*')
    .order('is_current', { ascending: false })
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching terms:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch terms: ${error.message}`
    })
  }

  return data || []
})
