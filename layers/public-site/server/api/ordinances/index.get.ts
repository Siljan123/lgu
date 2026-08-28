import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase('public')
  const query = getQuery(event)

  try {
    let dbQuery = supabase
      .schema('public')
      .from('legal_documents')
      .select('*')

    // Filter by type
    if (query.type && query.type !== 'all') {
      dbQuery = dbQuery.eq('type', query.type as string)
    }

    // Filter by status
    if (query.status && query.status !== 'all') {
      dbQuery = dbQuery.eq('status', query.status as string)
    }

    // Filter by year (date_issued starts with year or within year)
    if (query.year && query.year !== 'all') {
      const yearStr = String(query.year).trim()
      const startDate = `${yearStr}-01-01`
      const endDate = `${yearStr}-12-31`
      dbQuery = dbQuery.gte('date_issued', startDate).lte('date_issued', endDate)
    }

    // Filter by tag
    if (query.tag && query.tag !== 'all') {
      dbQuery = dbQuery.contains('tags', [query.tag as string])
    }

    // Search query (title, document_number, or description)
    if (query.search && typeof query.search === 'string' && query.search.trim()) {
      const s = query.search.trim()
      dbQuery = dbQuery.or(`title.ilike.%${s}%,document_number.ilike.%${s}%,description.ilike.%${s}%`)
    }

    // Sorting
    if (query.sort === 'date_issued_asc') {
      dbQuery = dbQuery.order('date_issued', { ascending: true })
    } else if (query.sort === 'created_at_desc') {
      dbQuery = dbQuery.order('created_at', { ascending: false })
    } else {
      // Default: latest date issued first, then created_at
      dbQuery = dbQuery.order('date_issued', { ascending: false }).order('created_at', { ascending: false })
    }

    const { data, error } = await dbQuery

    if (error) {
      console.error('Error fetching legal_documents from Supabase:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch legal documents: ${error.message}`
      })
    }

    return data || []
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Unexpected error in GET /api/ordinances:', err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Internal server error while fetching legal documents.'
    })
  }
})
