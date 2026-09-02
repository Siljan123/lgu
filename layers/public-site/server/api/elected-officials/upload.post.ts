import { randomUUID } from 'node:crypto'
import { useServerSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('governance')
  
  // Read multipart form-data
  const formData = await readMultipartFormData(event)
  
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded.'
    })
  }

  // Find the target file field (e.g., 'file', 'image', or 'avatar')
  const file = formData.find((item) => item.name === 'file' || item.name === 'image' || item.name === 'avatar')

  if (!file || !file.data || !file.type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file payload.'
    })
  }

  // Validate allowed image types
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  if (!allowedMimeTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unsupported file type. Only JPEG, PNG, WEBP, and SVG are allowed.'
    })
  }

  // Generate unique file path
  const extension = file.type.split('/')[1]?.replace('svg+xml', 'svg') || 'png'
  const fileName = `${randomUUID()}.${extension}`
  const filePath = `avatars/${fileName}`
  const bucketName = 'officials'

  // Ensure bucket exists or auto-create if missing
  try {
    const { data: buckets } = await client.storage.listBuckets()
    if (buckets && !buckets.some((b) => b.name === bucketName)) {
      await client.storage.createBucket(bucketName, { public: true })
    }
  } catch (err) {
    console.warn('Bucket verification warning:', err)
  }

  // Upload to Supabase Storage (bypassing RLS with service_role)
  const { data, error } = await client.storage
    .from(bucketName)
    .upload(filePath, file.data, {
      contentType: file.type,
      upsert: true
    })

  if (error) {
    console.error('Supabase storage upload error:', error)
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
    publicUrl: publicUrlData.publicUrl
  }
})