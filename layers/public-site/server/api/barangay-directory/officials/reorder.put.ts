import { useServerSupabase } from '../../../utils/supabase'

function isUUID(str?: string | null): boolean {
  if (!str) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

/**
 * Persist the display order of sibling officials.
 * Body: { barangayId: string, items: Array<{ id: string, sort_order: number }> }
 * Each update is scoped to the given barangay so one barangay can't touch another's rows.
 */
export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const body = await readBody(event)

  const barangayId = body?.barangayId || body?.barangay_id
  const items = Array.isArray(body?.items) ? body.items : []

  if (!isUUID(barangayId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid barangayId is required.'
    })
  }

  if (items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'items[] with { id, sort_order } entries is required.'
    })
  }

  let updated = 0

  for (const item of items) {
    const id = item?.id
    const sortOrder = Number(item?.sort_order)

    if (!isUUID(id) || !Number.isFinite(sortOrder)) continue

    const { error } = await client
      .schema('barangay_directory')
      .from('elected_officials')
      .update({ sort_order: sortOrder })
      .eq('id', id)
      .eq('barangay_id', barangayId)

    if (error) {
      console.error('Error reordering official:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to reorder officials: ${error.message}`
      })
    }

    updated++
  }

  return { success: true, updated }
})
