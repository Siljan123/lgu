import type { OrgLabelOptions } from '../../../types/organization'
import { useServerSupabase } from '../../utils/supabase'

/**
 * Option source for the Label title dropdown in the municipal org-chart modals.
 *
 * Everything here is read LIVE from the database — deliberately no hardcoded
 * fallback list (unlike positions.get.ts), so the choices always reflect what the
 * LGU has actually created:
 *   - `labels`    distinct names of departments already flagged is_label = TRUE
 *   - `positions` distinct titles from governance.positions
 */
export default defineEventHandler(async (): Promise<OrgLabelOptions> => {
  const supabase = useServerSupabase('governance')

  const [{ data: labelDepts, error: labelErr }, { data: positions, error: posErr }] = await Promise.all([
    supabase
      .schema('governance')
      .from('departments')
      .select('name')
      .eq('is_label', true)
      .order('name', { ascending: true }),
    supabase
      .schema('governance')
      .from('positions')
      .select('title')
      .order('title', { ascending: true }),
  ])

  if (labelErr) {
    console.error('Error fetching label departments from Supabase:', labelErr)
  }
  if (posErr) {
    console.error('Error fetching positions from Supabase:', posErr)
  }

  const dedupeSorted = (values: (string | null | undefined)[]): string[] =>
    Array.from(
      new Set(
        values
          .map((v) => v?.trim())
          .filter((v): v is string => Boolean(v) && v !== '__custom__')
      )
    ).sort((a, b) => a.localeCompare(b))

  const labels = dedupeSorted((labelDepts || []).map((d) => d.name))
  const positionTitles = dedupeSorted((positions || []).map((p) => p.title))

  return {
    labels,
    // Don't repeat a title that is already offered as an existing label.
    positions: positionTitles.filter((t) => !labels.includes(t)),
  }
})
