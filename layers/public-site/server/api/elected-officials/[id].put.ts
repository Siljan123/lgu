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
  const isLabel = body.is_label !== undefined || body.isLabel !== undefined
    ? Boolean(body.is_label ?? body.isLabel)
    : undefined

  if (isLabel !== undefined) {
    payload.is_label = isLabel
    if (isLabel) {
      payload.first_name = null
      payload.middle_name = null
      payload.last_name = null
      payload.avatar_url = null
      payload.contact = null
      if (body.label_name || body.position || body.position_title || body.first_name) {
        payload.label_name = (body.label_name || body.position || body.position_title || body.first_name).trim()
      }
    } else {
      payload.label_name = null
      if (body.first_name !== undefined) payload.first_name = body.first_name ? body.first_name.trim() : null
      if (body.middle_name !== undefined) payload.middle_name = body.middle_name ? body.middle_name.trim() : ''
      if (body.last_name !== undefined) payload.last_name = body.last_name ? body.last_name.trim() : null
    }
  } else {
    if (body.label_name !== undefined) payload.label_name = body.label_name ? body.label_name.trim() : null
    if (body.first_name !== undefined) payload.first_name = body.first_name ? body.first_name.trim() : null
    if (body.middle_name !== undefined) payload.middle_name = body.middle_name ? body.middle_name.trim() : ''
    if (body.last_name !== undefined) payload.last_name = body.last_name ? body.last_name.trim() : null
  }

  if (body.avatar_url !== undefined || body.image_url !== undefined || body.photo_url !== undefined) {
    payload.avatar_url = body.avatar_url ?? body.image_url ?? body.photo_url ?? null
  }

  if (body.contact !== undefined) {
    payload.contact = body.contact ? body.contact.trim() : null
  }

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