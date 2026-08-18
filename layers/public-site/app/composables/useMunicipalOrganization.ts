import { ref, computed, watch } from 'vue'
import type {
  MunicipalDepartmentNode,
  AddNodePayload,
  EditNodePayload,
} from '../../types/organization'

function findNodeRecursive(
  current: MunicipalDepartmentNode | null | undefined,
  id: string
): MunicipalDepartmentNode | null {
  if (!current) return null
  if (current.id === id) return current
  if (current.children && current.children.length > 0) {
    for (const child of current.children) {
      const found = findNodeRecursive(child, id)
      if (found) return found
    }
  }
  return null
}

function countTreeNodes(roots: MunicipalDepartmentNode[]): {
  total: number
  primaryDepartments: number
  subUnits: number
  hasCustomizations: boolean
} {
  if (!roots || roots.length === 0) {
    return {
      total: 0,
      primaryDepartments: 0,
      subUnits: 0,
      hasCustomizations: false,
    }
  }

  let total = 0
  let subUnits = 0
  let primaryDepartments = 0
  let hasCustom = false

  function traverse(node: MunicipalDepartmentNode, depth = 0) {
    total++
    if (depth > 1) {
      subUnits++
    }
    if (node.isCustom) {
      hasCustom = true
    }
    if (node.children) {
      for (const child of node.children) {
        traverse(child, depth + 1)
      }
    }
  }

  for (const root of roots) {
    traverse(root, 0)
    primaryDepartments += root.children?.length ?? 0
  }

  return {
    total,
    primaryDepartments,
    subUnits,
    hasCustomizations: hasCustom,
  }
}

export function useMunicipalOrganization() {
  const isMutating = ref(false)
  const searchQuery = ref('')
  const selectedOfficeId = ref<string>('mayor-root')
  const viewMode = ref<'all' | 'focused'>('all')

  const {
    data: treeRoot,
    pending,
    error,
    refresh,
  } = useAsyncData<MunicipalDepartmentNode>(
    'municipal-organization',
    () => $fetch<MunicipalDepartmentNode>('/api/organization')
  )

  const {
    data: positions,
    pending: positionsPending,
    refresh: refreshPositions,
  } = useAsyncData<string[]>(
    'municipal-positions',
    () => $fetch<string[]>('/api/organization/positions'),
    { default: () => [] }
  )

  const treeRoots = computed<MunicipalDepartmentNode[]>(() => {
    const customRoots = (treeRoot.value as any)?.roots as MunicipalDepartmentNode[] | undefined
    if (customRoots && customRoots.length > 0) return customRoots
    return treeRoot.value ? [treeRoot.value] : []
  })

  // Sync default root ID when tree loads
  watch(
    treeRoot,
    (root) => {
      if (root && (selectedOfficeId.value === 'mayor-root' || !selectedOfficeId.value)) {
        selectedOfficeId.value = root.id
      }
    },
    { immediate: true }
  )

  const isRootSelected = computed(() => {
    if (!treeRoot.value) return true
    return (
      selectedOfficeId.value === 'mayor-root' ||
      selectedOfficeId.value === 'all' ||
      treeRoots.value.some((r) => r.id === selectedOfficeId.value)
    )
  })

  function selectOffice(id: string, mode?: 'focused' | 'all') {
    if (id === 'mayor-root' || id === 'all' || treeRoots.value.some((r) => r.id === id)) {
      selectedOfficeId.value = id
      viewMode.value = 'all'
    } else {
      selectedOfficeId.value = id
      viewMode.value = mode || 'focused'
    }
  }

  function getNodeById(id: string): MunicipalDepartmentNode | null {
    if (id === 'mayor-root' && treeRoots.value[0]) return treeRoots.value[0]
    for (const root of treeRoots.value) {
      const found = findNodeRecursive(root, id)
      if (found) return found
    }
    return null
  }

  const selectedOffice = computed<MunicipalDepartmentNode | null>(() => {
    if (!treeRoot.value) return null
    const found = getNodeById(selectedOfficeId.value)
    return found || treeRoots.value[0] || treeRoot.value
  })

  // Returns either the full tree (or all roots attached) or focused branch
  const activeTreeData = computed<MunicipalDepartmentNode | null>(() => {
    if (!treeRoot.value) return null
    if (viewMode.value === 'focused' && !isRootSelected.value) {
      const branch = getNodeById(selectedOfficeId.value)
      if (branch) return branch
    }
    return treeRoot.value
  })

  const stats = computed(() => countTreeNodes(treeRoots.value))

  async function addNode(payload: AddNodePayload): Promise<boolean> {
    isMutating.value = true
    try {
      const res = await $fetch<{ success: boolean; node?: MunicipalDepartmentNode }>('/api/organization', {
        method: 'POST',
        body: payload,
      })
      await Promise.all([refresh(), refreshPositions()])
      return Boolean(res?.success)
    } catch (err) {
      console.error('Failed to add organization node to Supabase:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  async function editNode(payload: EditNodePayload): Promise<boolean> {
    isMutating.value = true
    try {
      await $fetch(`/api/organization/${payload.nodeId}`, {
        method: 'PUT',
        body: payload,
      })
      await Promise.all([refresh(), refreshPositions()])
      return true
    } catch (err) {
      console.error('Failed to update organization node in Supabase:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  async function deleteNode(nodeId: string): Promise<boolean> {
    isMutating.value = true
    try {
      await $fetch(`/api/organization/${nodeId}`, {
        method: 'DELETE',
      })
      if (selectedOfficeId.value === nodeId) {
        selectedOfficeId.value = 'mayor-root'
        viewMode.value = 'all'
      }
      await refresh()
      return true
    } catch (err) {
      console.error('Failed to delete organization node from Supabase:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  const flatDepartments = computed(() => {
    const list: {
      id: string
      title: string
      acronym?: string
      category?: string
      headName?: string
      position?: string
      depth: number
      parentId?: string
      isCustom?: boolean
      childrenCount: number
      description?: string
    }[] = []

    function walk(node: MunicipalDepartmentNode, depth = 0, parentId?: string) {
      list.push({
        id: node.id,
        title: node.title,
        acronym: node.acronym,
        category: node.category,
        headName: node.member?.[0]?.name,
        position: node.member?.[0]?.position || node.member?.[0]?.role,
        depth,
        parentId,
        isCustom: node.isCustom,
        childrenCount: node.children?.length ?? 0,
        description: node.description,
      })

      if (node.children) {
        for (const child of node.children) {
          walk(child, depth + 1, node.id)
        }
      }
    }

    for (const root of treeRoots.value) {
      walk(root, 0)
    }
    return list
  })

  // Categorized offices list for the sidebar
  const categorizedOffices = computed(() => {
    const categories: Record<string, typeof flatDepartments.value> = {
      'Executive & Mayor': [],
      'Administrative & Registry': [],
      'Financial & Fiscal': [],
      'Health & Social Services': [],
      'Technical & Planning': [],
      'Economic & Agriculture': [],
      'Custom Sub-Units & Independent Offices': [],
    }

    for (const item of flatDepartments.value ?? []) {
      if (item.id === 'mayor-root' || item.category === 'Office') {
        categories['Executive & Mayor']!.push(item)
      } else if (item.category === 'administrative' || item.title.includes('Resource') || item.title.includes('Civil Registry') || item.title.includes('General Services')) {
        categories['Administrative & Registry']!.push(item)
      } else if (item.category === 'financial' || item.title.includes('Treasurer') || item.title.includes('Assessor') || item.title.includes('Accounting') || item.title.includes('Budget')) {
        categories['Financial & Fiscal']!.push(item)
      } else if (item.category === 'social' || item.title.includes('Health') || item.title.includes('Social Welfare')) {
        categories['Health & Social Services']!.push(item)
      } else if (item.category === 'technical' || item.title.includes('Planning') || item.title.includes('Engineering') || item.title.includes('Environment') || item.title.includes('Disaster')) {
        categories['Technical & Planning']!.push(item)
      } else if (item.category === 'economic' || item.title.includes('Agriculture') || item.title.includes('Cooperative') || item.title.includes('Enterprise')) {
        categories['Economic & Agriculture']!.push(item)
      } else {
        categories['Custom Sub-Units & Independent Offices']!.push(item)
      }
    }

    return Object.entries(categories).filter(([_, items]) => items.length > 0)
  })

  const filteredDepartments = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return flatDepartments.value

    return flatDepartments.value.filter(
      (dept) =>
        dept.title.toLowerCase().includes(q) ||
        dept.acronym?.toLowerCase().includes(q) ||
        dept.headName?.toLowerCase().includes(q) ||
        dept.description?.toLowerCase().includes(q)
    )
  })

  return {
    treeRoot,
    treeRoots,
    activeTreeData,
    positions,
    positionsPending,
    refreshPositions,
    selectedOfficeId,
    selectedOffice,
    isRootSelected,
    viewMode,
    pending,
    isMutating,
    error,
    stats,
    searchQuery,
    flatDepartments,
    filteredDepartments,
    categorizedOffices,
    selectOffice,
    addNode,
    editNode,
    deleteNode,
    getNodeById,
    refresh,
  }
}
