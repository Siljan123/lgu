import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('governance')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Official ID parameter is required.'
    })
  }

  // 1. Find the official to get their parent_id
  const { data: official } = await client
    .schema('governance')
    .from('officials')
    .select('parent_id')
    .eq('id', id)
    .maybeSingle()

  const parentId = official?.parent_id || null

  // 2. Re-parent any direct subordinates to the deleted official's parent
  await client
    .schema('governance')
    .from('officials')
    .update({ parent_id: parentId })
    .eq('parent_id', id)

  // 3. Delete the official
  const { error } = await client
    .schema('governance')
    .from('officials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting official in Supabase governance schema:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return { success: true, message: 'Elected official deleted successfully.' }
})