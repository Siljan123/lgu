import { useServerSupabase } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Landmark ID is required.'
    })
  }

  const { error } = await client
    .schema('barangay_directory')
    .from('barangay_landmark')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting landmark:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete landmark: ${error.message}`
    })
  }

  return { success: true, message: 'Landmark deleted successfully.' }
})
