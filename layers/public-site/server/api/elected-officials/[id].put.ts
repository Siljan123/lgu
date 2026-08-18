import { useServerSupabase } from '../../utils/supabase'

function isUUID(str?: string | null): boolean {
  if (!str) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('governance')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Official ID parameter is required.'
    })
  }

  if (body.parent_id && body.parent_id === id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'An official cannot report to themselves.'
    })
  }

  const payload: Record<string, any> = {}
  if (body.first_name !== undefined) payload.first_name = body.first_name.trim()
  if (body.middle_name !== undefined) payload.middle_name = body.middle_name.trim()
  if (body.last_name !== undefined) payload.last_name = body.last_name.trim()
  if (body.image_url !== undefined) payload.image_url = body.image_url || null
  if (body.contact !== undefined) payload.contact = body.contact ? body.contact.trim() : null

  if (body.position_id !== undefined) {
    if (isUUID(body.position_id)) {
      payload.position_id = body.position_id
    } else {
      payload.position_id = null
    }
  } else if (body.position !== undefined || body.position_title !== undefined) {
    const posTitle = ((body.position || body.position_title) as string)?.trim()
    if (posTitle) {
      const { data: existingPos } = await client
        .schema('governance')
        .from('positions')
        .select('id')
        .eq('title', posTitle)
        .maybeSingle()

      if (existingPos?.id) {
        payload.position_id = existingPos.id
      } else {
        const { data: newPos } = await client
          .schema('governance')
          .from('positions')
          .insert({ title: posTitle, rank_order: 10 })
          .select('id')
          .single()
        if (newPos?.id) {
          payload.position_id = newPos.id
        }
      }
    }
  }

  if (body.parent_id !== undefined) {
    payload.parent_id = isUUID(body.parent_id) ? body.parent_id : null
  }

  const { data, error } = await client
    .schema('governance')
    .from('officials')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating official in Supabase governance schema:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  let positionRow = null
  if (data.position_id) {
    const { data: pos } = await client
      .schema('governance')
      .from('positions')
      .select('id, title, rank_order')
      .eq('id', data.position_id)
      .maybeSingle()
    positionRow = pos
  }

  return {
    ...data,
    position: positionRow,
  }
})