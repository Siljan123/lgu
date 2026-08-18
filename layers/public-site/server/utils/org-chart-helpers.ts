import type { MunicipalDepartmentNode, MunicipalDepartmentMember } from '../../types/organization'

export interface DepartmentRow {
  id: string
  name: string
  acronym: string | null
  description: string | null
  parent_id: string | null
  order_index: number | null
}

export interface PositionRow {
  id: string
  title: string
}

export interface EmployeeRow {
  id: string
  first_name: string
  middle_name: string
  last_name: string
  image_url: string | null
  contact: string | null
  position_id: string | null
  department_id: string
}

export function splitFullName(fullName: string): { first_name: string; middle_name: string; last_name: string } {
  const trimmed = (fullName || '').trim()
  if (!trimmed) {
    return { first_name: 'Office', middle_name: '', last_name: 'Head' }
  }
  const words = trimmed.split(/\s+/)
  if (words.length === 1) {
    return { first_name: words[0]!, middle_name: '', last_name: words[0]! }
  }
  if (words.length === 2) {
    return { first_name: words[0]!, middle_name: '', last_name: words[1]! }
  }
  if (words.length === 3) {
    return { first_name: words[0]!, middle_name: words[1]!, last_name: words[2]! }
  }
  return {
    first_name: words.slice(0, words.length - 2).join(' '),
    middle_name: words[words.length - 2]!,
    last_name: words[words.length - 1]!,
  }
}

export function formatFullName(first_name?: string, middle_name?: string, last_name?: string): string {
  const parts = [first_name, middle_name, last_name].map((s) => (s || '').trim()).filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unassigned Officer'
}

export function toValidUUID(str: string): string {
  if (!str) return '00000000-0000-4000-8000-000000000000'
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
  if (isUUID) return str

  // Deterministic mapping for legacy string IDs
  if (str === 'mayor-root') return '305451c6-aa72-4bf9-9480-5509c8263c23'
  if (str === 'mayor-head') return 'da1794fa-791f-402c-a6dc-444f671665ab'
  if (str === 'pos-mayor-head') return 'b66aec09-a5cb-44d7-9089-cf0b2ebe7db7'

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const hex = Math.abs(hash).toString(16).padStart(12, '0')
  return `00000000-0000-4000-8000-${hex.slice(0, 12)}`
}

export function buildAllOrgChartTrees(
  departments: DepartmentRow[],
  positions: PositionRow[],
  employees: EmployeeRow[]
): MunicipalDepartmentNode[] {
  if (!departments || departments.length === 0) return []

  // Map positions by id
  const positionById = new Map<string, PositionRow>()
  for (const pos of positions) {
    positionById.set(pos.id, pos)
  }

  // Map employees by department_id
  const employeesByDept = new Map<string, MunicipalDepartmentMember[]>()
  for (const emp of employees) {
    const list = employeesByDept.get(emp.department_id) || []
    const matchedPos = emp.position_id ? positionById.get(emp.position_id) : null
    const posTitle = matchedPos?.title || 'Office Head'
    const fullName = (emp.first_name || emp.last_name)
      ? formatFullName(emp.first_name, emp.middle_name, emp.last_name)
      : ((emp as any).name || 'Unassigned Officer')
    list.push({
      id: emp.id,
      name: fullName,
      first_name: emp.first_name,
      middle_name: emp.middle_name,
      last_name: emp.last_name,
      role: posTitle,
      position: posTitle,
      position_id: emp.position_id || matchedPos?.id || undefined,
      department_id: emp.department_id,
      add: posTitle,
      image_url: emp.image_url || undefined,
      contact: emp.contact || undefined,
    })
    employeesByDept.set(emp.department_id, list)
  }

  // Create node map
  const nodeMap = new Map<string, MunicipalDepartmentNode>()
  for (const dept of departments) {
    const members = employeesByDept.get(dept.id) || [
      {
        id: `head-${dept.id}`,
        name: dept.name,
        role: 'Department Head',
        position: 'Head of Office',
        add: dept.name,
      },
    ]

    nodeMap.set(dept.id, {
      id: dept.id,
      title: dept.name,
      acronym: dept.acronym || undefined,
      description: dept.description || undefined,
      member: members,
      children: [],
    })
  }

  const rootNodes: MunicipalDepartmentNode[] = []

  // Link children to parents and collect root nodes
  for (const dept of departments) {
    const currentNode = nodeMap.get(dept.id)!
    if (!dept.parent_id || !nodeMap.has(dept.parent_id)) {
      rootNodes.push(currentNode)
    } else {
      const parentNode = nodeMap.get(dept.parent_id)
      if (parentNode) {
        if (!parentNode.children) parentNode.children = []
        parentNode.children.push(currentNode)
      }
    }
  }

  return rootNodes
}

export function buildOrgChartTree(
  departments: DepartmentRow[],
  positions: PositionRow[],
  employees: EmployeeRow[]
): MunicipalDepartmentNode | null {
  const rootNodes = buildAllOrgChartTrees(departments, positions, employees)
  if (rootNodes.length === 0) return null

  // Prioritize mayor-root if present
  const mayorTree = rootNodes.find(
    (t) => t.id === '305451c6-aa72-4bf9-9480-5509c8263c23' || t.id === '00000000-0000-4000-8000-000000000001' || t.id === 'mayor-root'
  )

  return mayorTree || rootNodes[0] || null
}

export async function seedDefaultOrgDataToSupabase() {
  const supabase = useServerSupabase('governance')

  // Flatten default tree grouped by hierarchy level/depth
  const deptByDepth = new Map<number, DepartmentRow[]>()
  const posInserts: PositionRow[] = []
  const empInserts: EmployeeRow[] = []

  function traverse(node: MunicipalDepartmentNode, parentId: string | null, index: number, depth: number) {
    const deptUUID = toValidUUID(node.id)
    const parentUUID = parentId ? toValidUUID(parentId) : null

    const list = deptByDepth.get(depth) || []
    list.push({
      id: deptUUID,
      name: node.title,
      acronym: node.acronym || null,
      description: node.description || null,
      parent_id: parentUUID,
      order_index: index,
    })
    deptByDepth.set(depth, list)

    if (node.member && node.member.length > 0) {
      for (const m of node.member) {
        const empUUID = toValidUUID(m.id)
        const posUUID = toValidUUID(`pos-${m.id}`)
        const posTitle = m.position || m.role || 'Office Head'

        posInserts.push({
          id: posUUID,
          title: posTitle,
        })

        const nameSplit = (m.first_name && m.last_name)
          ? { first_name: m.first_name, middle_name: m.middle_name || '', last_name: m.last_name }
          : splitFullName(m.name)

        empInserts.push({
          id: empUUID,
          first_name: nameSplit.first_name,
          middle_name: nameSplit.middle_name,
          last_name: nameSplit.last_name,
          image_url: m.image_url || m.avatar || null,
          contact: m.contact || null,
          position_id: posUUID,
          department_id: deptUUID,
        })
      }
    }

    if (node.children) {
      node.children.forEach((child, childIdx) => {
        traverse(child, node.id, childIdx, depth + 1)
      })
    }
  }

  // Clear existing records
  await supabase.schema('governance').from('employees').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.schema('governance').from('positions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.schema('governance').from('departments').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Insert departments level by level to respect parent_id foreign key hierarchy
  const maxDepth = Math.max(...Array.from(deptByDepth.keys()))
  for (let d = 0; d <= maxDepth; d++) {
    const depts = deptByDepth.get(d)
    if (depts && depts.length > 0) {
      const { error: deptErr } = await supabase.schema('governance').from('departments').upsert(depts)
      if (deptErr) console.error(`Error inserting depth ${d} departments in Supabase:`, deptErr)
    }
  }

  if (posInserts.length > 0) {
    const { error: posErr } = await supabase.schema('governance').from('positions').upsert(posInserts)
    if (posErr) console.error('Error seeding positions in Supabase:', posErr)
  }

  if (empInserts.length > 0) {
    const { error: empErr } = await supabase.schema('governance').from('employees').upsert(empInserts)
    if (empErr) console.error('Error seeding employees in Supabase:', empErr)
  }
}
