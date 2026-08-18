import type {
  OrganizationChartMember,
  OrganizationChartNode,
} from 'organization-chart-vue3'

export type { OrganizationChartMember, OrganizationChartNode }

export interface PositionRow {
  id: string
  title: string
  rank_order?: number
  created_at?: string
  updated_at?: string
}

export interface OfficialRow {
  id: string
  first_name: string
  middle_name?: string | null
  last_name: string
  image_url?: string | null
  contact?: string | null
  position_id?: string | null
  parent_id?: string | null
  created_at?: string
  updated_at?: string
  position?: PositionRow | null
  parent?: {
    id: string
    first_name: string
    last_name: string
  } | null
}

// Backward-compatible interface for legacy references
export interface Official {
  id: string
  name: string
  position: string
  photo_url: string | null
  bio: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
}

export interface OfficialMember extends OrganizationChartMember {
  id: string
  name: string
  first_name?: string
  middle_name?: string
  last_name?: string
  role?: string
  position?: string
  position_id?: string
  parent_id?: string | null
  image_url?: string
  photo_url?: string
  contact?: string
  add?: string
}

export interface OfficialNode extends OrganizationChartNode {
  id: string
  title: string
  rank_order?: number
  parent_id?: string | null
  member: OfficialMember[]
  children?: OfficialNode[]
}

export interface AddOfficialPayload {
  first_name: string
  middle_name?: string
  last_name: string
  position_id?: string
  position?: string
  parent_id?: string | null
  contact?: string
  image_url?: string | null
}

export interface EditOfficialPayload {
  id: string
  first_name: string
  middle_name?: string
  last_name: string
  position_id?: string
  position?: string
  parent_id?: string | null
  contact?: string
  image_url?: string | null
}