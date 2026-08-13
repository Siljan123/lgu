// composables/useOfficials.ts
import { officials } from '../../data/officials'
import type { Official, OrganizationChartNode } from '../../types/official'

function buildOfficialsTree(rows: Official[], parentId: string | null = null): OrganizationChartNode[] {
  return rows
    .filter((r) => r.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => {
      const children = buildOfficialsTree(rows, r.id)
      return {
        id: r.id,
        title: r.position,
        member: [
          {
            id: r.id,
            name: r.name,
            add: r.position,
            image_url: r.photo_url ?? undefined,
          },
        ],
        ...(children.length ? { children } : {}),
      }
    })
}

export function useOfficials() {
  const rows = ref<Official[]>(officials.filter((o) => o.is_active))
  const pending = ref(false)
  const error = ref<unknown>(null)

  const tree = computed<OrganizationChartNode[]>(() => buildOfficialsTree(rows.value))

  const treeRoot = computed<OrganizationChartNode | null>(() => tree.value[0] ?? null)


  const refresh = async () => {}

  return { rows, tree, treeRoot, pending, error, refresh }
}