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
    const { data, error } = await supabase
      .schema('public')
      .from('legal_documents')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error(`Error fetching legal document ${id}:`, error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: `Legal document with ID '${id}' not found.`
      })
    }

    return data
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error(`Unexpected error in GET /api/ordinances/${id}:`, err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Internal server error while fetching legal document.'
    })
  }
})
