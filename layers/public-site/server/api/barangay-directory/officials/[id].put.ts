import { useServerSupabase } from '../../../utils/supabase'

function isUUID(str?: string | null): boolean {
  if (!str) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Official ID is required.'
    })
  }

  const payload: Record<string, any> = {}

  if (body.name !== undefined) payload.name = String(body.name).trim()
  if (body.committee !== undefined) payload.committee = body.committee ? String(body.committee).trim() : null
  if (body.avatar_url !== undefined || body.avatar !== undefined || body.avatarUrl !== undefined) {
    payload.avatar_url = body.avatar_url ?? body.avatar ?? body.avatarUrl ?? null
  }
  if (body.contact !== undefined) payload.contact = body.contact ? String(body.contact).trim() : null
  if (body.order_index !== undefined || body.orderIndex !== undefined) {
    payload.order_index = Number(body.order_index ?? body.orderIndex)
  }
  if (body.barangay_id !== undefined || body.barangayId !== undefined) {
    payload.barangay_id = String(body.barangay_id || body.barangayId).trim()
  }
  if (body.parent_id !== undefined || body.parentId !== undefined) {
    const pId = body.parent_id || body.parentId
    payload.parent_id = isUUID(pId) ? pId : null
  }

  if (body.position_id !== undefined) {
    payload.position_id = isUUID(body.position_id) ? body.position_id : null
  } else if (body.title || body.position || body.role) {
    const posTitle = String(body.title || body.position || body.role).trim()
    const { data: existingPos } = await client
      .schema('barangay_directory')
      .from('position')
      .select('id')
      .ilike('title', posTitle)
      .maybeSingle()

    if (existingPos?.id) {
      payload.position_id = existingPos.id
    } else {
      const { data: newPos } = await client
        .schema('barangay_directory')
        .from('position')
        .insert({
          title: posTitle,
          rank_order: Number(body.order_index ?? 10)
        })
        .select('id')
        .single()

      if (newPos?.id) {
        payload.position_id = newPos.id
      }
    }
  }

  const { data, error } = await client
    .schema('barangay_directory')
    .from('elected_officials')
    .update(payload)
    .eq('id', id)
    .select(`
      id,
      barangay_id,
      parent_id,
      name,
      committee,
      avatar_url,
      contact,
      order_index,
      position:position (
        id,
        title,
        rank_order
      )
    `)
    .single()

  if (error) {
    console.error('Error updating barangay official:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update official: ${error.message}`
    })
  }

  return data
})
