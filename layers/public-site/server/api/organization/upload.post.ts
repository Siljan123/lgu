// server/api/organization/upload.post.ts
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase()
  
  const formData = await readMultipartFormData(event)
  
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded.'
    })
  }

  // Find the target file field (e.g., 'file' or 'image')
  const file = formData.find((item) => item.name === 'file' || item.name === 'image')

  if (!file || !file.data || !file.type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file payload.'
    })
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  if (!allowedMimeTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unsupported file type. Only JPEG, PNG, WEBP, and SVG are allowed.'
    })
  }

  const extension = file.type.split('/')[1]?.replace('svg+xml', 'svg') || 'png'
  const fileName = `${randomUUID()}.${extension}`
  const filePath = `avatars/${fileName}`
  const bucketName = 'officials'

  const { data, error } = await client.storage
    .from(bucketName)
    .upload(filePath, file.data, {
      contentType: file.type,
      upsert: false
    })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Storage upload failed: ${error.message}`
    })
  }

  const { data: publicUrlData } = client.storage
    .from(bucketName)
    .getPublicUrl(data.path)

  return {
    success: true,
    path: data.path,
    publicUrl: publicUrlData.publicUrl
  }
})
