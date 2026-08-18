import type { MunicipalDepartmentNode } from '../../../types/organization'

export default defineEventHandler(async (event): Promise<MunicipalDepartmentNode> => {
  const supabase = useServerSupabase('governance')

  let { data: departments, error: deptErr } = await supabase
    .schema('governance')
    .from('departments')
    .select('*')
    .order('order_index', { ascending: true })

  if (deptErr) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch departments from Supabase: ${deptErr.message}`,
    })
  }

  // Auto-seed if database has no departments
  if (!departments || departments.length === 0) {
    await seedDefaultOrgDataToSupabase()
    const { data: seededDepts, error: reDeptErr } = await supabase
      .schema('governance')
      .from('departments')
      .select('*')
      .order('order_index', { ascending: true })
    if (reDeptErr) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch seeded departments: ${reDeptErr.message}`,
      })
    }
    departments = seededDepts || []
  }

  const [{ data: positions, error: posErr }, { data: employees, error: empErr }] = await Promise.all([
    supabase.schema('governance').from('positions').select('*'),
    supabase.schema('governance').from('employees').select('*'),
  ])

  if (posErr) {
    console.error('Error fetching positions from Supabase:', posErr)
  }
  if (empErr) {
    console.error('Error fetching employees from Supabase:', empErr)
  }

  const allTrees = buildAllOrgChartTrees(
    departments || [],
    positions || [],
    employees || [],
  )

  const tree = buildOrgChartTree(
    departments || [],
    positions || [],
    employees || [],
  )

  if (!tree) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Organization root not found in database.',
    })
  }

  return {
    ...tree,
    roots: allTrees,
  } as any
})
