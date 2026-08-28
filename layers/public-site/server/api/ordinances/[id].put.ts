import { useServerSupabase } from '../../utils/supabase'

const VALID_TYPES = ['ordinance', 'executive_order', 'resolution']
const VALID_STATUSES = ['active', 'repealed', 'amended', 'draft']

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase('public')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document ID is required.'
    })
  }

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Update payload cannot be empty.'
    })
  }

  const updates: Record<string, any> = {
    updated_at: new Date().toISOString()
  }

  if (body.type !== undefined) {
    const type = String(body.type).trim().toLowerCase()
    if (!VALID_TYPES.includes(type)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid document type. Allowed types are: ${VALID_TYPES.join(', ')}`
      })
    }
    updates.type = type
  }

  if (body.document_number !== undefined) {
    const docNum = String(body.document_number).trim()
    if (!docNum) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Document number cannot be empty.'
      })
    }
    updates.document_number = docNum
  }

  if (body.title !== undefined) {
    const title = String(body.title).trim()
    if (!title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Document title cannot be empty.'
      })
    }
    updates.title = title
  }

  if (body.description !== undefined) {
    updates.description = body.description ? String(body.description).trim() : null
  }

  if (body.pdf_url !== undefined) {
    const pdfUrl = String(body.pdf_url).trim()
    if (!pdfUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'PDF document URL cannot be empty.'
      })
    }
    updates.pdf_url = pdfUrl
  }

  if (body.date_issued !== undefined) {
    const dateIssued = String(body.date_issued).trim()
    if (!dateIssued || isNaN(Date.parse(dateIssued))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid date issued is required (YYYY-MM-DD).'
      })
    }
    updates.date_issued = dateIssued
  }

  if (body.status !== undefined) {
    const status = String(body.status).trim().toLowerCase()
    if (!VALID_STATUSES.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid document status. Allowed statuses are: ${VALID_STATUSES.join(', ')}`
      })
    }
    updates.status = status
  }

  if (body.tags !== undefined) {
    if (Array.isArray(body.tags)) {
      updates.tags = body.tags.map((t: any) => String(t).trim()).filter(Boolean)
    } else if (typeof body.tags === 'string') {
      updates.tags = body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    }
  }

  try {
    const { data, error } = await supabase
      .schema('public')
      .from('legal_documents')
      .update(updates)
      .eq('id', id)
      .select('*')
      .maybeSingle()

    if (error) {
      console.error(`Error updating legal document ${id}:`, error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: `Legal document with ID '${id}' not found.`
      })
    }

    return data
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error(`Unexpected error in PUT /api/ordinances/${id}:`, err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Internal server error while updating legal document.'
    })
  }
})
