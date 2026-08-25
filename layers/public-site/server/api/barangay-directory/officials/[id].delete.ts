import { useServerSupabase } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  const client = useServerSupabase('barangay_directory')
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Official ID is required.'
    })
  }

  // 1. Find the target official/label to get its barangay_id
  const { data: targetOfficial } = await client
    .schema('barangay_directory')
    .from('elected_officials')
    .select('id, barangay_id, is_label')
    .eq('id', id)
    .maybeSingle()

  if (targetOfficial?.barangay_id) {
    // 2. Fetch all officials in this barangay to resolve all recursive descendants
    const { data: allOfficials } = await client
      .schema('barangay_directory')
      .from('elected_officials')
      .select('id, parent_id')
      .eq('barangay_id', targetOfficial.barangay_id)

    if (allOfficials && allOfficials.length > 0) {
      const idsToDelete = new Set<string>([id])
      let addedMore = true
      while (addedMore) {
        addedMore = false
        for (const off of allOfficials) {
          if (off.parent_id && idsToDelete.has(off.parent_id) && !idsToDelete.has(off.id)) {
            idsToDelete.add(off.id)
            addedMore = true
          }
        }
      }

      // Delete all target IDs (label/official + all recursive descendants)
      const { error: batchDeleteError } = await client
        .schema('barangay_directory')
        .from('elected_officials')
        .delete()
        .in('id', Array.from(idsToDelete))

      if (batchDeleteError) {
        console.error('Error deleting official and descendants in Supabase:', batchDeleteError)
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to delete official and children: ${batchDeleteError.message}`
        })
      }

      return {
        success: true,
        message: `Deleted ${idsToDelete.size} item(s) successfully.`
      }
    }
  }

  // Fallback single delete
  const { error } = await client
    .schema('barangay_directory')
    .from('elected_officials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting barangay official:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete official: ${error.message}`
    })
  }

  return { success: true, message: 'Barangay official deleted successfully.' }
})
