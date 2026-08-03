export interface NavItem {
  name: string
  to?: string | { name: string; path?: string }
  type: 'link' | 'dropdown'
  description?: string
  children?: NavItem[]
}
