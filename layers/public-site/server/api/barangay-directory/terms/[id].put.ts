import { useServerSupabase } from '../../../utils/supabase'

function toBool(val: unknown): boolean {
  return val === true || val === 'true' || val === 1 || val === '1'
}

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Term ID is required.'
    })
  }

  const payload: Record<string, any> = {}
  if (body.label !== undefined) payload.label = String(body.label).trim()
  if (body.start_date !== undefined || body.startDate !== undefined) {
    payload.start_date = body.start_date || body.startDate || null
  }
  if (body.end_date !== undefined || body.endDate !== undefined) {
    payload.end_date = body.end_date || body.endDate || null
  }

  let makeCurrent: boolean | undefined
  if (body.is_current !== undefined || body.isCurrent !== undefined) {
    makeCurrent = toBool(body.is_current ?? body.isCurrent)
    payload.is_current = makeCurrent
  }

  // Clear the flag on the other terms before turning this one on.
  if (makeCurrent === true) {
    const { error: clearErr } = await client
      .schema('barangay_directory')
      .from('term')
      .update({ is_current: false })
      .neq('id', id)
      .eq('is_current', true)
    if (clearErr) {
      console.error('Error clearing current term flag:', clearErr)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to set current term: ${clearErr.message}`
      })
    }
  }

  const { data, error } = await client
    .schema('barangay_directory')
    .from('term')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating term:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update term: ${error.message}`
    })
  }

  return data
})
