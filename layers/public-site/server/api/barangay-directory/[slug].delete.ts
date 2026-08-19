import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Barangay slug/ID is required.'
    })
  }

  const { error } = await client
    .schema('barangay_directory')
    .from('barangay')
    .delete()
    .eq('id', slug)

  if (error) {
    console.error('Error deleting barangay:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete barangay: ${error.message}`
    })
  }

  return { success: true, message: `Barangay '${slug}' deleted successfully.` }
})
