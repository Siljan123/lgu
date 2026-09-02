import { useServerSupabase } from '../../utils/supabase'

function isUUID(str?: string | null): boolean {
  if (!str) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('governance')
  const body = await readBody(event)
  const isLabel = Boolean(body.is_label ?? body.isLabel)

  let firstName = (body.first_name || '').trim()
  let middleName = (body.middle_name || '').trim()
  let lastName = (body.last_name || '').trim()

  let labelName: string | null = null

  if (isLabel) {
    labelName = (body.label_name || body.position || body.position_title || body.name || firstName || 'Section Label').trim()
    firstName = ''
    lastName = ''
  } else if ((!firstName || !lastName) && body.name) {
    const parts = body.name.trim().split(/\s+/)
    if (parts.length === 1) {
      firstName = parts[0]
      lastName = parts[0]
    } else if (parts.length === 2) {
      firstName = parts[0]
      lastName = parts[1]
    } else {
      firstName = parts.slice(0, -1).join(' ')
      lastName = parts[parts.length - 1]
    }
  }

  if (!isLabel && (!firstName || !lastName)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'First name and last name are required for elected officials.'
    })
  }

  let positionId: string | null = null

  if (body.position_id && isUUID(body.position_id)) {
    positionId = body.position_id
  } else if (body.position || body.position_title || (isLabel && labelName)) {
    const posTitle = (body.position || body.position_title || labelName).trim()
    const { data: existingPos } = await client
      .schema('governance')
      .from('positions')
      .select('id')
      .eq('title', posTitle)
      .maybeSingle()

    if (existingPos?.id) {
      positionId = existingPos.id
    } else {
      const { data: newPos } = await client
        .schema('governance')
        .from('positions')
        .insert({
          title: posTitle,
          rank_order: 10,
        })
        .select('id')
        .single()

      if (newPos?.id) {
        positionId = newPos.id
      }
    }
  }

  let parentId: string | null = null
  if (body.parent_id && isUUID(body.parent_id)) {
    parentId = body.parent_id
  }

  const { data, error } = await client
    .schema('governance')
    .from('officials')
    .insert([
      {
        label_name: isLabel ? labelName : null,
        first_name: isLabel ? null : firstName,
        middle_name: isLabel ? null : (middleName || ''),
        last_name: isLabel ? null : lastName,
        avatar_url: isLabel ? null : (body.avatar_url || body.image_url || body.photo_url || null),
        contact: isLabel ? null : (body.contact ? body.contact.trim() : null),
        position_id: positionId,
        parent_id: parentId,
        is_label: isLabel
      }
    ])
    .select('*')
    .single()

  if (error) {
    console.error('Error inserting official in Supabase governance schema:', error)
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

  setResponseStatus(event, 201)
  return {
    ...data,
    position: positionRow,
  }
})