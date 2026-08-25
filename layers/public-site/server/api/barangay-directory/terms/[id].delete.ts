import { useServerSupabase } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Term ID is required.'
    })
  }

  // Deleting a term cascades to every official recorded under it
  // (elected_officials.term_id has ON DELETE CASCADE).
  const { error } = await client
    .schema('barangay_directory')
    .from('term')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting term:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete term: ${error.message}`
    })
  }

  setResponseStatus(event, 204)
  return { success: true }
})
