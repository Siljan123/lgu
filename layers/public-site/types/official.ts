// types/official.ts
import type {
  OrganizationChartMember,
  OrganizationChartNode,
} from 'organization-chart-vue3'

export type { OrganizationChartMember, OrganizationChartNode }

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