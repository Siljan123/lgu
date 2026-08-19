import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const query = getQuery(event)

  const fetchFromSchema = async (schemaName: string) => {
    let dbQuery = client
      .schema(schemaName)
      .from('barangay')
      .select('*')
      .order('name', { ascending: true })

    // Optional filter: ?classification=Urban | Rural
    if (query.classification && query.classification !== 'All') {
      if (query.classification === 'Urban') {
        dbQuery = dbQuery.in('classification', ['Urban', 'Poblacion'])
      } else {
        dbQuery = dbQuery.eq('classification', String(query.classification))
      }
    }

    // Optional search: ?search=alegria
    if (query.search) {
      const s = `%${String(query.search).trim()}%`
      dbQuery = dbQuery.ilike('name', s)
    }

    return await dbQuery
  }

  let { data, error } = await fetchFromSchema('barangay_directory')

  if (error) {
    console.error('Error fetching barangays from Supabase:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch barangays from Supabase: ${error.message}`
    })
  }

  return data || []
})