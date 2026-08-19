import { useServerSupabase } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Official ID is required.'
    })
  }

  const { error } = await client
    .schema('barangay_directory')
    .from('elected_officials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting barangay official:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete official: ${error.message}`
    })
  }

  return { success: true, message: 'Barangay official deleted successfully.' }
})
