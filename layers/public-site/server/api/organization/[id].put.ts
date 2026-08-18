import type { EditNodePayload } from '../../../types/organization'

export default defineEventHandler(async (event) => {
  const paramId = getRouterParam(event, 'id')
  const body = await readBody<EditNodePayload>(event)

  if (!paramId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Department ID parameter is required.',
    })
  }

  if (!body || !body.title?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title is required.',
    })
  }

  const supabase = useServerSupabase('governance')
  const deptUUID = toValidUUID(paramId)

  // Update department (matching schema: name, acronym, description, updated_at)
  const updatePayload: Record<string, any> = {
    name: body.title.trim(),
    updated_at: new Date().toISOString(),
  }

  if (body.acronym !== undefined) {
    updatePayload.acronym = body.acronym.trim() || ''
  }
  if (body.description !== undefined) {
    updatePayload.description = body.description.trim() || ''
  }

  const { error: deptErr } = await supabase
    .schema('governance')
    .from('departments')
    .update(updatePayload)
    .eq('id', deptUUID)

  if (deptErr) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update department: ${deptErr.message}`,
    })
  }

  // Update employee head and position if provided
  if (body.headName || body.firstName || body.middleName || body.lastName || body.position || body.contact !== undefined) {
    const positionTitle = body.position?.trim()

    const firstName = body.firstName?.trim() || ''
    const middleName = body.middleName?.trim() || ''
    const lastName = body.lastName?.trim() || ''

    const nameSplit = (firstName || lastName)
      ? { first_name: firstName, middle_name: middleName, last_name: lastName }
      : (body.headName ? splitFullName(body.headName.trim()) : null)

    // Find existing employee in this department
    const { data: existingEmployees } = await supabase
      .schema('governance')
      .from('employees')
      .select('id, position_id')
      .eq('department_id', deptUUID)
      .limit(1)

    if (existingEmployees && existingEmployees.length > 0) {
      const emp = existingEmployees[0]!
      const empUpdate: Record<string, any> = {
        updated_at: new Date().toISOString(),
      }
      if (nameSplit) {
        empUpdate.first_name = nameSplit.first_name
        empUpdate.middle_name = nameSplit.middle_name
        empUpdate.last_name = nameSplit.last_name
      }
      if (body.contact !== undefined) {
        empUpdate.contact = body.contact.trim() || null
      }

      await supabase.schema('governance').from('employees').update(empUpdate).eq('id', emp.id)

      if (positionTitle && emp.position_id) {
        await supabase
          .schema('governance')
          .from('positions')
          .update({ title: positionTitle, updated_at: new Date().toISOString() })
          .eq('id', emp.position_id)
      }
    } else if (nameSplit) {
      const posId = crypto.randomUUID()
      const empId = crypto.randomUUID()
      await supabase.schema('governance').from('positions').insert({
        id: posId,
        title: positionTitle || 'Office Head',
      })
      await supabase.schema('governance').from('employees').insert({
        id: empId,
        first_name: nameSplit.first_name,
        middle_name: nameSplit.middle_name,
        last_name: nameSplit.last_name,
        department_id: deptUUID,
        position_id: posId,
        contact: body.contact?.trim() || null,
      })
    }
  }

  return {
    success: true,
    message: 'Node updated successfully',
  }
})
