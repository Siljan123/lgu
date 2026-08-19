import { randomUUID } from 'node:crypto'
import { useServerSupabase } from '../../../utils/supabase'

function isUUID(str?: string | null): boolean {
  if (!str) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Barangay slug/ID is required.'
    })
  }

  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Official name is required.'
    })
  }

  let positionId: string | null = null

  if (body.position_id && isUUID(body.position_id)) {
    positionId = body.position_id
  } else if (body.title || body.position || body.role) {
    const posTitle = String(body.title || body.position || body.role).trim()
    const { data: existingPos } = await client
      .schema('barangay_directory')
      .from('position')
      .select('id')
      .ilike('title', posTitle)
      .maybeSingle()

    if (existingPos?.id) {
      positionId = existingPos.id
    } else {
      const { data: newPos } = await client
        .schema('barangay_directory')
        .from('position')
        .insert({
          title: posTitle,
          rank_order: Number(body.order_index) || 10
        })
        .select('id')
        .single()

      if (newPos?.id) {
        positionId = newPos.id
      }
    }
  }

  const officialId = body.id ? String(body.id).trim() : randomUUID()
  const pId = body.parent_id || body.parentId

  const payload = {
    id: officialId,
    barangay_id: slug,
    parent_id: isUUID(pId) ? pId : null,
    position_id: positionId,
    name: String(body.name).trim(),
    committee: body.committee ? String(body.committee).trim() : null,
    avatar_url: body.avatar_url ?? body.avatar ?? body.avatarUrl ?? null,
    contact: body.contact ? String(body.contact).trim() : null,
    order_index: Number(body.order_index ?? body.orderIndex ?? 10)
  }

  const { data, error } = await client
    .schema('barangay_directory')
    .from('elected_officials')
    .insert([payload])
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
    console.error('Error inserting barangay official:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create official: ${error.message}`
    })
  }

  setResponseStatus(event, 201)
  return data
})
