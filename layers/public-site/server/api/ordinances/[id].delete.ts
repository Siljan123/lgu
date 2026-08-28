import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase('public')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required.'
    })
  }

  try {
    const { error } = await supabase
      .schema('public')
      .from('legal_documents')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting legal document ${id}:`, error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    return {
      success: true,
      id,
      message: 'Legal document deleted successfully.'
    }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error(`Unexpected error in DELETE /api/ordinances/${id}:`, err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Internal server error while deleting legal document.'
    })
  }
})
