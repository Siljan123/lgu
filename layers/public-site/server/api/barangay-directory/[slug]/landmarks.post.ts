import { randomUUID } from 'node:crypto'
import { useServerSupabase } from '../../../utils/supabase'

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
      statusMessage: 'Landmark name is required.'
    })
  }

  const landmarkId = body.id ? String(body.id).trim() : randomUUID()

  const payload = {
    id: landmarkId,
    barangay_id: slug,
    name: String(body.name).trim(),
    category: String(body.category || 'General').trim(),
    lat: Number(body.lat ?? 0),
    lng: Number(body.lng ?? 0),
    address: String(body.address || '').trim()
  }

  const { data, error } = await client
    .schema('barangay_directory')
    .from('barangay_landmark')
    .insert([payload])
    .select('*')
    .single()

  if (error) {
    console.error('Error inserting landmark:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create landmark: ${error.message}`
    })
  }

  setResponseStatus(event, 201)
  return data
})
