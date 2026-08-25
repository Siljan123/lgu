import { useServerSupabase } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const id = getRouterParam(event, 'barangay')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Barangay  is required.'
    })
  }

  const { error } = await client
    .schema('barangay_directory')
    .from('barangay')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting barangay:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete barangay: ${error.message}`
    })
  }

  return { success: true, message: `Barangay '${id}' deleted successfully.` }
})
