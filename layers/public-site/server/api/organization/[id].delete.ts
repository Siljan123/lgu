export default defineEventHandler(async (event) => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Department ID parameter is required.',
    })
  }

  const deptUUID = toValidUUID(paramId)

  if (paramId === 'mayor-root' || deptUUID === '305451c6-aa72-4bf9-9480-5509c8263c23' || deptUUID === '00000000-0000-4000-8000-000000000001') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot delete the Municipal Mayor root node.',
    })
  }

  const supabase = useServerSupabase()

  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', deptUUID)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete department: ${error.message}`,
    })
  }

  return {
    success: true,
    message: 'Node deleted successfully',
  }
})
