import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase('governance')
  const query = getQuery(event)

  // 1. Format specifically for orgchart-vue tree building view if requested
  if (query.format === 'tree') {
    const { data, error } = await supabase
      .schema('governance')
      .from('v_orgchart_officials')
      .select('*')

    if (error) {
      console.error('Error fetching v_orgchart_officials from Supabase governance schema:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch tree from Supabase: ${error.message}`
      })
    }

    return data || []
  }

  // 2. Fetch officials from Supabase governance schema
  const { data: officials, error: offErr } = await supabase
    .schema('governance')
    .from('officials')
    .select('*')
    .order('created_at', { ascending: true })

  if (offErr) {
    console.error('Error fetching officials from Supabase governance schema:', offErr)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch elected officials from Supabase: ${offErr.message}`
    })
  }

  // 3. Fetch positions from Supabase governance schema
  const { data: positions, error: posErr } = await supabase
    .schema('governance')
    .from('positions')
    .select('id, title, rank_order')

  if (posErr) {
    console.error('Error fetching positions from Supabase governance schema:', posErr)
  }

  const posMap = new Map<string, { id: string; title: string; rank_order?: number }>()
  if (positions) {
    for (const p of positions) {
      posMap.set(p.id, p)
    }
  }

  // 4. Return dynamic relational list from Supabase
  const result = (officials || []).map((off) => ({
    ...off,
    position: off.position_id ? posMap.get(off.position_id) || null : null,
  }))

  return result
})