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
  /** TRUE = this node is a position/section LABEL only, not a real office with a person. */
  is_label?: boolean | null
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
  /** Mirrors the owning node's kind so the #member slot can render a section-label card. */
  is_label?: boolean
}

export interface MunicipalDepartmentNode extends OrganizationChartNode {
  id: string
  title: string
  acronym?: string
  description?: string
  category?: string
  isCustom?: boolean
  code?: string
  /** TRUE = position/section LABEL node; FALSE/undefined = real office with a personnel card. */
  is_label?: boolean
  /**
   * Presentation-only: set when this node sits directly under a label node and therefore
   * inherits the label's title instead of repeating it. Consumed by the chart's
   * #node-title slot — never blank `title` itself, the library drops the whole node.
   */
  hideTitle?: boolean
  /** Presentation-only: extra class applied to the library's `.org-title` wrapper. */
  titleClass?: string
  member: MunicipalDepartmentMember[]
  children?: MunicipalDepartmentNode[]
}

export interface AddNodePayload {
  parentId?: string | null
  title: string
  acronym?: string
  /** TRUE = create a position/section LABEL node (no position/employee rows written). */
  isLabel?: boolean
  isOfficial?: boolean
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
  /** Toggles the node between a LABEL and a real office. */
  isLabel?: boolean
  isOfficial?: boolean
  headName?: string
  firstName?: string
  middleName?: string
  lastName?: string
  position?: string
  contact?: string
  description?: string
}

/** Response shape of GET /api/organization/labels — all options are read live from the DB. */
export interface OrgLabelOptions {
  /** Distinct titles of departments already flagged is_label = TRUE. */
  labels: string[]
  /** Distinct titles from governance.positions. */
  positions: string[]
}

