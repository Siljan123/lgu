import type { AddNodePayload, MunicipalDepartmentNode } from '../../../types/organization'

export default defineEventHandler(async (event) => {
  
  const body = await readBody<AddNodePayload>(event)

  if (!body || !body.title?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Office / department title is required.',
    })
  }

  const supabase = useServerSupabase()
  const isRootNode = !body.parentId || body.parentId === '__root__' || body.parentId === 'null' || body.parentId === 'undefined'
  const parentUUID = isRootNode ? null : toValidUUID(body.parentId!)

  if (parentUUID) {
    // Verify parent node exists in database; if not, seed default data
    const { data: parentDept } = await supabase
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

  // Insert department (matching schema: id, name, acronym, description, parent_id, order_index)
  const { error: deptErr } = await supabase
    .from('departments')
    .insert({
      id: nodeId,
      name: body.title.trim(),
      acronym: body.acronym?.trim() || '',
      description: body.description?.trim() || '',
      parent_id: parentUUID,
      order_index: 99,
    })

  if (deptErr) {
    console.error('Error inserting department in Supabase:', deptErr)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to insert department node: ${deptErr.message}`,
    })
  }

  // Insert position (matching schema: id, title)
  await supabase
    .from('positions')
    .insert({
      id: posId,
      title: positionTitle,
    })

  // Insert employee (matching schema: id, first_name, middle_name, last_name, position_id, department_id, contact)
  await supabase
    .from('employees')
    .insert({
      id: empId,
      first_name: nameSplit.first_name,
      middle_name: nameSplit.middle_name,
      last_name: nameSplit.last_name,
      department_id: nodeId,
      position_id: posId,
      contact: body.contact?.trim() || null,
    })

  const newNode: MunicipalDepartmentNode = {
    id: nodeId,
    title: body.title.trim(),
    acronym: body.acronym?.trim() || undefined,
    description: body.description?.trim() || undefined,
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
      },
    ],
    children: [],
  }

  return {
    success: true,
    node: newNode,
  }
})
