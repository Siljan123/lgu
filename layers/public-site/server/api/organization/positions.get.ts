import { useServerSupabase } from '../../utils/supabase'
import { seedDefaultOrgDataToSupabase } from '../../utils/org-chart-helpers'

export default defineEventHandler(async (event): Promise<string[]> => {
  const supabase = useServerSupabase('governance')

  let { data: positions, error: posErr } = await supabase
    .schema('governance')
    .from('positions')
    .select('title')
    .order('title', { ascending: true })

  if (posErr) {
    console.error('Error fetching positions from Supabase:', posErr)
  }

  // If positions table is empty, auto-seed and query again
  if (!positions || positions.length === 0) {
    try {
      await seedDefaultOrgDataToSupabase()
      const { data: rePositions } = await supabase
        .schema('governance')
        .from('positions')
        .select('title')
        .order('title', { ascending: true })
      positions = rePositions || []
    } catch (seedErr) {
      console.error('Error seeding default org positions:', seedErr)
    }
  }

  // Extract unique distinct position titles and sort alphabetically
  const uniqueTitles = Array.from(
    new Set(
      (positions || [])
        .map((p) => p.title?.trim())
        .filter((t): t is string => Boolean(t))
    )
  ).sort((a, b) => a.localeCompare(b))

  if (uniqueTitles.length === 0) {
    return [
      'Department Head',
      'Division Chief',
      'Division Head',
      'General Services Officer',
      'Head of Executive Office',
      'Legal Records Officer',
      'MCDO Head',
      'MDRRMO Head',
      'MEEDO Head',
      'MENRO Head',
      'MPDC Head',
      'MSWDO Head',
      'Municipal Accountant',
      'Municipal Administrator',
      'Municipal Agriculturist',
      'Municipal Assessor',
      'Municipal Budget Officer',
      'Municipal Civil Registrar',
      'Municipal Engineer',
      'Municipal Health Officer / MHO Head',
      'Municipal HRMO Officer',
      'Municipal Legal Officer',
      'Municipal Mayor',
      'Municipal Treasurer',
      'Officer-in-Charge',
      'Section Chief',
      'Section Head',
      'Secretariat Head',
      'Unit Head',
      'Unit In-Charge',
    ]
  }

  return uniqueTitles
})
