import { useServerSupabase } from '../../utils/supabase'

export interface PositionOption {
  id: string
  title: string
  rank_order: number
}

export default defineEventHandler(async (event): Promise<PositionOption[]> => {
  const supabase = useServerSupabase('governance')

  const { data: positions, error } = await supabase
    .schema('governance')
    .from('positions')
    .select('id, title, rank_order')
    .order('rank_order', { ascending: true })

  if (error) {
    console.error('Error fetching positions from Supabase governance schema:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch positions from Supabase: ${error.message}`
    })
  }

  return positions || []
})
