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

  const { data: official, error } = await client
    .schema('governance')
    .from('officials')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !official) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Elected official not found.'
    })
  }

  let positionRow = null
  if (official.position_id) {
    const { data: pos } = await client
      .schema('governance')
      .from('positions')
      .select('id, title, rank_order')
      .eq('id', official.position_id)
      .maybeSingle()
    positionRow = pos
  }

  let parentRow = null
  if (official.parent_id) {
    const { data: parent } = await client
      .schema('governance')
      .from('officials')
      .select('id, first_name, last_name')
      .eq('id', official.parent_id)
      .maybeSingle()
    parentRow = parent
  }

  return {
    ...official,
    position: positionRow,
    parent: parentRow,
  }
})