import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Barangay name and ID/slug are required.'
    })
  }

  const rawClassification = body.classification || 'Rural'
  const classification = rawClassification === 'Poblacion' ? 'Urban' : rawClassification

  const lat = Number(body.lat ?? body.coordinates?.lat ?? 0)
  const lng = Number(body.lng ?? body.coordinates?.lng ?? 0)

  const payload = {
    name: String(body.name).trim(),
    classification,
    postal_code: String(body.postal_code || body.postalCode || '8501').trim(),
    population: Number(body.population) || 0,
    census_year: String(body.census_year || body.censusYear || '2024').trim(),
    elevation_asl: String(body.elevation_asl || body.elevationASL || '0m ASL').trim(),
    elevation_meters: Number(body.elevation_meters || body.elevationMeters) || 0,
    lat,
    lng,
    coordinates_display: String(
      body.coordinates_display || 
      body.coordinates?.display || 
      `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`
    ).trim(),
    land_area_sq_km: Number(body.land_area_sq_km || body.landAreaSqKm) || 0,
    hall_address: String(body.hall_address || body.hallAddress || '').trim(),
    contact_phone: String(body.contact_phone || body.contactPhone || '').trim(),
    contact_email: String(body.contact_email || body.contactEmail || '').trim(),
    map_embed_url: body.map_embed_url || body.mapEmbedUrl || null,
    description: body.description ? String(body.description).trim() : null
  }

  const { data, error } = await client
    .schema('barangay_directory')
    .from('barangay')
    .insert([payload])
    .select('*')
    .single()

  if (error) {
    console.error('Error inserting barangay:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create barangay: ${error.message}`
    })
  }

  setResponseStatus(event, 201)
  return data
})
