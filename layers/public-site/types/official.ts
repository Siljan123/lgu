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
  label_name?: string | null
  first_name?: string | null
  middle_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
  image_url?: string | null
  photo_url?: string | null
  contact?: string | null
  position_id?: string | null
  parent_id?: string | null
  is_label?: boolean
  created_at?: string
  updated_at?: string
  position?: PositionRow | null
  parent?: {
    id: string
    first_name?: string | null
    last_name?: string | null
  } | null
}

// Backward-compatible interface for legacy references
export interface Official {
  id: string
  label_name?: string | null
  name: string
  position: string
  avatar_url: string | null
  image_url?: string | null
  bio: string | null
  parent_id: string | null
  sort_order: number
  is_label?: boolean
  is_active: boolean
}

export interface OfficialMember extends OrganizationChartMember {
  id: string
  name: string
  label_name?: string
  first_name?: string
  middle_name?: string
  last_name?: string
  role?: string
  position?: string
  position_id?: string
  parent_id?: string | null
  is_label?: boolean
  avatar_url?: string
  image_url?: string
  photo_url?: string
  contact?: string
  add?: string
}

export interface OfficialNode extends OrganizationChartNode {
  id: string
  title: string
  label_name?: string
  rank_order?: number
  parent_id?: string | null
  is_label?: boolean
  hideTitle?: boolean
  member: OfficialMember[]
  children?: OfficialNode[]
}

export interface AddOfficialPayload {
  label_name?: string | null
  first_name?: string | null
  middle_name?: string
  last_name?: string | null
  position_id?: string
  position?: string
  parent_id?: string | null
  is_label?: boolean
  contact?: string
  avatar_url?: string | null
  image_url?: string | null
}

export interface EditOfficialPayload {
  id: string
  label_name?: string | null
  first_name?: string | null
  middle_name?: string
  last_name?: string | null
  position_id?: string
  position?: string
  parent_id?: string | null
  is_label?: boolean
  contact?: string
  avatar_url?: string | null
  image_url?: string | null
}