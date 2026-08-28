import { randomUUID } from 'node:crypto'
import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('public')

  // Read multipart form-data
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded.'
    })
  }

  // Find target file field ('file', 'pdf', or 'document')
  const file = formData.find(
    (item) => item.name === 'file' || item.name === 'pdf' || item.name === 'document'
  )

  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file payload.'
    })
  }

  // Validate allowed PDF MIME types or filenames
  const fileType = file.type || 'application/pdf'
  const isPdfMime = fileType === 'application/pdf' || fileType === 'application/x-pdf' || fileType === 'application/acrobat'
  const isPdfExt = (file.filename || '').toLowerCase().endsWith('.pdf')

  if (!isPdfMime && !isPdfExt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unsupported file type. Only official PDF documents are allowed.'
    })
  }

  // Check file size (max 30MB)
  const maxSize = 30 * 1024 * 1024
  if (file.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File size exceeds maximum limit of 30MB.'
    })
  }

  // Generate unique file path
  const sanitizedOriginalName = (file.filename || 'document.pdf')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .slice(0, 50)
  const fileName = `${Date.now()}_${randomUUID().slice(0, 8)}_${sanitizedOriginalName}`
  const filePath = `pdfs/${fileName}`
  const bucketName = 'legal-documents'

  // Upload to Supabase Storage (using service_role)
  const { data, error } = await client.storage
    .from(bucketName)
    .upload(filePath, file.data, {
      contentType: 'application/pdf',
      upsert: false
    })

  if (error) {
    console.error('Storage upload failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Storage upload failed: ${error.message}`
    })
  }

  // Retrieve public URL
  const { data: publicUrlData } = client.storage
    .from(bucketName)
    .getPublicUrl(data.path)

  return {
    success: true,
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
    filename: file.filename || fileName,
    fileSize: file.data.length
  }
})
