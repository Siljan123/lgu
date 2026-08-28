import { useServerSupabase } from '../../utils/supabase'

const VALID_TYPES = ['ordinance', 'executive_order', 'resolution']
const VALID_STATUSES = ['active', 'repealed', 'amended', 'draft']

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase('public')
  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body cannot be empty.'
    })
  }

  const type = (body.type || '').trim().toLowerCase()
  const documentNumber = (body.document_number || '').trim()
  const title = (body.title || '').trim()
  const description = body.description ? String(body.description).trim() : null
  const pdfUrl = (body.pdf_url || '').trim()
  const dateIssued = (body.date_issued || '').trim()
  const status = (body.status || 'active').trim().toLowerCase()

  // Validate type
  if (!type || !VALID_TYPES.includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid document type. Allowed types are: ${VALID_TYPES.join(', ')}`
    })
  }

  // Validate document number
  if (!documentNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document number is required (e.g., "Ordinance No. 2026-001").'
    })
  }

  // Validate title
  if (!title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Document title is required.'
    })
  }

  // Validate pdf url
  if (!pdfUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'PDF document URL or uploaded file is required.'
    })
  }

  // Validate date issued
  if (!dateIssued || isNaN(Date.parse(dateIssued))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid date issued is required (YYYY-MM-DD).'
    })
  }

  // Validate status
  if (!VALID_STATUSES.includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid document status. Allowed statuses are: ${VALID_STATUSES.join(', ')}`
    })
  }

  // Sanitize tags
  let tags: string[] = []
  if (Array.isArray(body.tags)) {
    tags = body.tags
      .map((t: any) => String(t).trim())
      .filter(Boolean)
  } else if (typeof body.tags === 'string' && body.tags.trim()) {
    tags = body.tags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean)
  }

  try {
    const { data, error } = await supabase
      .schema('public')
      .from('legal_documents')
      .insert([
        {
          type,
          document_number: documentNumber,
          title,
          description,
          pdf_url: pdfUrl,
          date_issued: dateIssued,
          status,
          tags
        }
      ])
      .select('*')
      .single()

    if (error) {
      console.error('Error inserting legal document:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    setResponseStatus(event, 201)
    return data
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('Unexpected error in POST /api/ordinances:', err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Internal server error while creating legal document.'
    })
  }
})
