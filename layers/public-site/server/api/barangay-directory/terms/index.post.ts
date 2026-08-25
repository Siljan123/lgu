import { useServerSupabase } from '../../../utils/supabase'

function toBool(val: unknown): boolean {
  return val === true || val === 'true' || val === 1 || val === '1'
}

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const body = await readBody(event)

  const label = body?.label ? String(body.label).trim() : ''
  if (!label) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Term label is required.'
    })
  }

  let makeCurrent = toBool(body.is_current ?? body.isCurrent)

  // The very first term ever created should become the current one so the
  // directory always has a default to display.
  if (!makeCurrent) {
    const { count } = await client
      .schema('barangay_directory')
      .from('term')
      .select('id', { count: 'exact', head: true })
    if (!count) makeCurrent = true
  }

  // Keep is_current exclusive: clear the flag on every other term first.
  if (makeCurrent) {
    const { error: clearErr } = await client
      .schema('barangay_directory')
      .from('term')
      .update({ is_current: false })
      .eq('is_current', true)
    if (clearErr) {
      console.error('Error clearing current term flag:', clearErr)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to set current term: ${clearErr.message}`
      })
    }
  }

  const payload = {
    label,
    start_date: body.start_date || body.startDate || null,
    end_date: body.end_date || body.endDate || null,
    is_current: makeCurrent
  }

  const { data, error } = await client
    .schema('barangay_directory')
    .from('term')
    .insert([payload])
    .select('*')
    .single()

  if (error) {
    console.error('Error creating term:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create term: ${error.message}`
    })
  }

  setResponseStatus(event, 201)
  return data
})
