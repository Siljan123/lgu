import type {
  OrganizationChartMember,
  OrganizationChartNode,
} from 'organization-chart-vue3'

export type { OrganizationChartMember, OrganizationChartNode }

export interface DepartmentRow {
  id: string
  name: string
  acronym?: string | null
  description?: string | null
  parent_id: string | null
  order_index: number
  created_at?: string
  updated_at?: string
}

export interface PositionRow {
  id: string
  title: string
  created_at?: string
  updated_at?: string
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
  created_at?: string
  updated_at?: string
}

export interface MunicipalDepartmentMember extends OrganizationChartMember {
  id: string
  name: string
  first_name?: string
  middle_name?: string
  last_name?: string
  role?: string
  position?: string
  position_id?: string
  department_id?: string
  add?: string
  avatar?: string
  image_url?: string
  email?: string
  contact?: string
}

export interface MunicipalDepartmentNode extends OrganizationChartNode {
  id: string
  title: string
  acronym?: string
  description?: string
  category?: string
  isCustom?: boolean
  code?: string
  member: MunicipalDepartmentMember[]
  children?: MunicipalDepartmentNode[]
}

export interface AddNodePayload {
  parentId?: string | null
  title: string
  acronym?: string
  headName?: string
  firstName?: string
  middleName?: string
  lastName?: string
  position?: string
  contact?: string
  description?: string
}

export interface EditNodePayload {
  nodeId: string
  title: string
  acronym?: string
  headName?: string
  firstName?: string
  middleName?: string
  lastName?: string
  position?: string
  contact?: string
  description?: string
}

