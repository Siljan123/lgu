import { randomUUID } from 'node:crypto'
import { useServerSupabase } from '../../../utils/supabase'
import { resolveTermId } from '../../../utils/barangayTerm'

function isUUID(str?: string | null): boolean {
  if (!str) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

function toBool(val: unknown): boolean {
  return val === true || val === 'true' || val === 1 || val === '1'
}

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const barangayId = getRouterParam(event, 'barangay')
  const body = await readBody(event)

  if (!barangayId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Barangay ID is required.'
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
          rank_order: 10
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
  const parentId = isUUID(pId) ? pId : null
  const isLabel = toBool(body.is_label ?? body.isLabel)

  // The new official belongs to a term: an explicit term_id from the body wins,
  // otherwise it lands in the current term.
  const termId = await resolveTermId(client, body.term_id || body.termId)

  // New nodes append to the end of their sibling group (same barangay + term +
  // parent), unless the caller explicitly provides a sort_order.
  let sortOrder = Number(body.sort_order)
  if (!Number.isFinite(sortOrder)) {
    sortOrder = 0
    let siblingQuery = client
      .schema('barangay_directory')
      .from('elected_officials')
      .select('sort_order')
      .eq('barangay_id', barangayId)
    if (termId) siblingQuery = siblingQuery.eq('term_id', termId)
    siblingQuery = parentId
      ? siblingQuery.eq('parent_id', parentId)
      : siblingQuery.is('parent_id', null)
    const { data: siblings } = await siblingQuery
      .order('sort_order', { ascending: false })
      .limit(1)
    if (siblings && siblings.length > 0 && typeof siblings[0]!.sort_order === 'number') {
      sortOrder = siblings[0]!.sort_order + 1
    }
  }

  const payload = {
    id: officialId,
    barangay_id: barangayId,
    term_id: termId,
    parent_id: parentId,
    position_id: positionId,
    is_label: isLabel,
    sort_order: sortOrder,
    name: String(body.name || body.title || body.position || 'Label').trim(),
    committee: !isLabel && body.committee ? String(body.committee).trim() : null,
    avatar_url: isLabel ? null : (body.avatar_url ?? body.avatar ?? body.avatarUrl ?? null),
    contact: !isLabel && body.contact ? String(body.contact).trim() : null
  }

  const { data, error } = await client
    .schema('barangay_directory')
    .from('elected_officials')
    .insert([payload])
    .select(`
      id,
      barangay_id,
      term_id,
      parent_id,
      is_label,
      sort_order,
      name,
      committee,
      avatar_url,
      contact,
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
