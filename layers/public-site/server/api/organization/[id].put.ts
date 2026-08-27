import type { EditNodePayload } from '../../../types/organization'

/** Accepts isLabel / is_label from either casing, and string booleans from form posts. */
function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value === 'true' || value === '1'
  return false
}

export default defineEventHandler(async (event) => {
  const paramId = getRouterParam(event, 'id')
  const body = await readBody<EditNodePayload & { is_label?: boolean }>(event)

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

  // Resolve the node kind. When the client omits it entirely, keep whatever is on the row
  // so callers that only patch a title can't silently flip a label back into an office.
  const rawKind = body.isLabel ?? body.is_label
  let isLabel: boolean
  if (rawKind === undefined || rawKind === null) {
    const { data: existingDept } = await supabase
      .schema('governance')
      .from('departments')
      .select('is_label')
      .eq('id', deptUUID)
      .maybeSingle()
    isLabel = toBool(existingDept?.is_label)
  } else {
    isLabel = toBool(rawKind)
  }

  // Update department (matching schema: name, acronym, description, is_label, updated_at)
  const updatePayload: Record<string, any> = {
    name: body.title.trim(),
    is_label: isLabel,
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

  // A label node has no personnel card, so skip the employee/position upsert entirely.
  // Any pre-existing employee rows are intentionally LEFT IN PLACE rather than deleted:
  // converting the node back to a real office then restores its personnel untouched.
  if (isLabel) {
    return {
      success: true,
      message: 'Section label updated successfully',
    }
  }

  // Update employee head and position if provided
  if (body.headName || body.firstName || body.middleName || body.lastName || body.position || body.contact !== undefined || body.avatar_url !== undefined) {
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
      if (body.avatar_url !== undefined) {
        empUpdate.avatar_url = body.avatar_url || null
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
        avatar_url: body.avatar_url || null,
      })
    }

    if (body.isOfficial && nameSplit) {
      // Find if this position already exists in officials
      const { data: existingOfficials } = await supabase
        .schema('governance')
        .from('officials')
        .select('id, position_id')
        .eq('first_name', nameSplit.first_name)
        .eq('last_name', nameSplit.last_name)
        .limit(1)

      if (existingOfficials && existingOfficials.length > 0) {
        const off = existingOfficials[0]!
        const offUpdate: Record<string, any> = {
          updated_at: new Date().toISOString(),
          first_name: nameSplit.first_name,
          middle_name: nameSplit.middle_name,
          last_name: nameSplit.last_name,
        }
        if (body.contact !== undefined) {
          offUpdate.contact = body.contact.trim() || null
        }
        if (body.avatar_url !== undefined) {
          offUpdate.avatar_url = body.avatar_url || null
        }
        await supabase.schema('governance').from('officials').update(offUpdate).eq('id', off.id)
      } else {
        const offId = crypto.randomUUID()
        const posIdForOff = crypto.randomUUID()
        
        // We need a position in governance.positions
        await supabase.schema('governance').from('positions').insert({
          id: posIdForOff,
          title: positionTitle || 'Office Head',
        })
        
        await supabase.schema('governance').from('officials').insert({
          id: offId,
          first_name: nameSplit.first_name,
          middle_name: nameSplit.middle_name,
          last_name: nameSplit.last_name,
          contact: body.contact?.trim() || null,
          position_id: posIdForOff,
          avatar_url: body.avatar_url || null,
          parent_id: null,
        })
      }
    }
  }

  return {
    success: true,
    message: 'Node updated successfully',
  }
})
