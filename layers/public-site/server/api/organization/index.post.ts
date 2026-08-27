import type { AddNodePayload, MunicipalDepartmentNode } from '../../../types/organization'

/** Accepts isLabel / is_label from either casing, and string booleans from form posts. */
function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value === 'true' || value === '1'
  return false
}

export default defineEventHandler(async (event) => {

  const body = await readBody<AddNodePayload & { is_label?: boolean }>(event)

  if (!body || !body.title?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Office / department title is required.',
    })
  }

  const supabase = useServerSupabase('governance')
  const isLabel = toBool(body.isLabel ?? body.is_label)
  const isRootNode = !body.parentId || body.parentId === '__root__' || body.parentId === 'null' || body.parentId === 'undefined'
  const parentUUID = isRootNode ? null : toValidUUID(body.parentId!)

  if (parentUUID) {
    // Verify parent node exists in database; if not, seed default data
    const { data: parentDept } = await supabase
      .schema('governance')
      .from('departments')
      .select('id')
      .eq('id', parentUUID)
      .maybeSingle()

    if (!parentDept) {
      console.warn(`Parent department '${body.parentId}' not found in DB. Seeding defaults first...`)
      await seedDefaultOrgDataToSupabase()
    }
  }

  // Generate valid UUIDs
  const nodeId = crypto.randomUUID()
  const posId = crypto.randomUUID()
  const empId = crypto.randomUUID()

  const positionTitle = body.position?.trim() || 'Unit Head'

  const nameSplit = (body.firstName && body.lastName)
    ? { first_name: body.firstName.trim(), middle_name: body.middleName?.trim() || '', last_name: body.lastName.trim() }
    : splitFullName(body.headName?.trim() || body.title.trim())

  const formattedName = formatFullName(nameSplit.first_name, nameSplit.middle_name, nameSplit.last_name)

  // Insert department (matching schema: id, name, acronym, description, parent_id, is_label, order_index)
  const { error: deptErr } = await supabase
    .schema('governance')
    .from('departments')
    .insert({
      id: nodeId,
      name: body.title.trim(),
      acronym: body.acronym?.trim() || '',
      description: body.description?.trim() || '',
      parent_id: parentUUID,
      is_label: isLabel,
      order_index: 99,
    })

  if (deptErr) {
    console.error('Error inserting department in Supabase:', deptErr)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to insert department node: ${deptErr.message}`,
    })
  }

  // A LABEL node is a grouping header only: no position and no employee rows are written.
  // The chart synthesizes its single section-label member from the department row itself.
  if (isLabel) {
    const labelNode: MunicipalDepartmentNode = {
      id: nodeId,
      title: body.title.trim(),
      acronym: body.acronym?.trim() || undefined,
      description: body.description?.trim() || undefined,
      is_label: true,
      member: [
        {
          id: `label-${nodeId}`,
          name: body.title.trim(),
          department_id: nodeId,
          is_label: true,
        },
      ],
      children: [],
    }

    return {
      success: true,
      node: labelNode,
    }
  }

  // Insert position (matching schema: id, title)
  await supabase
    .schema('governance')
    .from('positions')
    .insert({
      id: posId,
      title: positionTitle,
    })

  // Insert employee (matching schema: id, first_name, middle_name, last_name, position_id, department_id, contact, avatar_url)
  await supabase
    .schema('governance')
    .from('employees')
    .insert({
      id: empId,
      first_name: nameSplit.first_name,
      middle_name: nameSplit.middle_name,
      last_name: nameSplit.last_name,
      department_id: nodeId,
      position_id: posId,
      contact: body.contact?.trim() || null,
      avatar_url: body.avatar_url || null,
    })

  if (body.isOfficial) {
    const offId = crypto.randomUUID()
    await supabase
      .schema('governance')
      .from('officials')
      .insert({
        id: offId,
        first_name: nameSplit.first_name,
        middle_name: nameSplit.middle_name,
        last_name: nameSplit.last_name,
        contact: body.contact?.trim() || null,
        position_id: posId,
        avatar_url: body.avatar_url || null,
        parent_id: null, // Admin can arrange it in Elected Officials page
      })
  }

  const newNode: MunicipalDepartmentNode = {
    id: nodeId,
    title: body.title.trim(),
    acronym: body.acronym?.trim() || undefined,
    description: body.description?.trim() || undefined,
    is_label: false,
    member: [
      {
        id: empId,
        name: formattedName,
        first_name: nameSplit.first_name,
        middle_name: nameSplit.middle_name,
        last_name: nameSplit.last_name,
        role: positionTitle,
        position: positionTitle,
        position_id: posId,
        department_id: nodeId,
        add: body.title.trim(),
        contact: body.contact?.trim() || undefined,
        avatar_url: body.avatar_url || undefined,
        is_label: false,
      },
    ],
    children: [],
  }

  return {
    success: true,
    node: newNode,
  }
})
