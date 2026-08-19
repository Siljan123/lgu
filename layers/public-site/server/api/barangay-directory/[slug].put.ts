import { useServerSupabase } from '../../utils/supabase'

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

  const payload: Record<string, any> = {}

  if (body.name !== undefined) payload.name = String(body.name).trim()
  if (body.classification !== undefined) {
    payload.classification = body.classification === 'Poblacion' ? 'Urban' : body.classification
  }
  if (body.postal_code !== undefined || body.postalCode !== undefined) {
    payload.postal_code = String(body.postal_code || body.postalCode).trim()
  }
  if (body.population !== undefined) payload.population = Number(body.population)
  if (body.census_year !== undefined || body.censusYear !== undefined) {
    payload.census_year = String(body.census_year || body.censusYear).trim()
  }
  if (body.elevation_asl !== undefined || body.elevationASL !== undefined) {
    payload.elevation_asl = String(body.elevation_asl || body.elevationASL).trim()
  }
  if (body.elevation_meters !== undefined || body.elevationMeters !== undefined) {
    payload.elevation_meters = Number(body.elevation_meters || body.elevationMeters)
  }
  if (body.lat !== undefined || body.coordinates?.lat !== undefined) {
    payload.lat = Number(body.lat ?? body.coordinates?.lat)
  }
  if (body.lng !== undefined || body.coordinates?.lng !== undefined) {
    payload.lng = Number(body.lng ?? body.coordinates?.lng)
  }
  if (body.coordinates_display !== undefined || body.coordinates?.display !== undefined) {
    payload.coordinates_display = String(body.coordinates_display || body.coordinates?.display).trim()
  } else if (payload.lat !== undefined && payload.lng !== undefined) {
    payload.coordinates_display = `${payload.lat.toFixed(4)}° N, ${payload.lng.toFixed(4)}° E`
  }
  if (body.land_area_sq_km !== undefined || body.landAreaSqKm !== undefined) {
    payload.land_area_sq_km = Number(body.land_area_sq_km || body.landAreaSqKm)
  }
  if (body.hall_address !== undefined || body.hallAddress !== undefined) {
    payload.hall_address = String(body.hall_address || body.hallAddress).trim()
  }
  if (body.contact_phone !== undefined || body.contactPhone !== undefined) {
    payload.contact_phone = String(body.contact_phone || body.contactPhone).trim()
  }
  if (body.contact_email !== undefined || body.contactEmail !== undefined) {
    payload.contact_email = String(body.contact_email || body.contactEmail).trim()
  }
  if (body.map_embed_url !== undefined || body.mapEmbedUrl !== undefined) {
    payload.map_embed_url = body.map_embed_url || body.mapEmbedUrl || null
  }
  if (body.description !== undefined) {
    payload.description = body.description ? String(body.description).trim() : null
  }

  const { data, error } = await client
    .schema('barangay_directory')
    .from('barangay')
    .update(payload)
    .eq('id', slug)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating barangay:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update barangay: ${error.message}`
    })
  }

  return data
})
