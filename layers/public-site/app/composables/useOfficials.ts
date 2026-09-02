// composables/useOfficials.ts
import { ref, computed } from 'vue'
import type {
  OfficialRow,
  OfficialNode,
  OfficialMember,
  AddOfficialPayload,
  EditOfficialPayload,
  PositionRow,
} from '../../types/official'

export function formatOfficialName(
  firstName?: string | null,
  middleName?: string | null,
  lastName?: string | null
): string {
  const parts = [firstName, middleName, lastName]
    .map((s) => (s || '').trim())
    .filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Elected Official'
}

function buildOfficialsTree(rows: OfficialRow[], parentId: string | null = null): OfficialNode[] {
  if (!rows || rows.length === 0) return []

  const matchingRows = rows.filter((r) => {
    if (parentId === null) {
      return !r.parent_id || r.parent_id === ''
    }
    return r.parent_id === parentId
  })

  // Sort by position rank_order ascending, then last_name
  matchingRows.sort((a, b) => {
    const rankA = a.position?.rank_order ?? 99
    const rankB = b.position?.rank_order ?? 99
    if (rankA !== rankB) return rankA - rankB
    return (a.last_name || '').localeCompare(b.last_name || '')
  })

  const parentRow = parentId ? rows.find((r) => r.id === parentId) : null

  return matchingRows.map((r) => {
    const posTitle = r.position?.title || 'Elected Official'
    const isLabel = Boolean(r.is_label)
    const labelTitle = r.label_name || posTitle
    const fullName = isLabel ? labelTitle : formatOfficialName(r.first_name, r.middle_name, r.last_name)
    const children = buildOfficialsTree(rows, r.id)
    const hideTitle = isLabel || (Boolean(parentRow?.is_label) && !isLabel)

    const member: OfficialMember = {
      id: r.id,
      name: fullName,
      label_name: r.label_name || undefined,
      first_name: r.first_name || undefined,
      middle_name: r.middle_name || undefined,
      last_name: r.last_name || undefined,
      role: isLabel ? labelTitle : posTitle,
      position: isLabel ? labelTitle : posTitle,
      position_id: r.position_id || r.position?.id || undefined,
      parent_id: r.parent_id,
      is_label: isLabel,
      add: isLabel ? labelTitle : posTitle,
      avatar_url: r.avatar_url || r.image_url || undefined,
      image_url: r.avatar_url || r.image_url || undefined,
      photo_url: r.avatar_url || r.image_url || undefined,
      contact: r.contact || undefined,
    }

    const node: OfficialNode = {
      id: r.id,
      title: isLabel ? labelTitle : posTitle,
      label_name: r.label_name || undefined,
      is_label: isLabel,
      hideTitle,
      rank_order: r.position?.rank_order ?? 99,
      parent_id: r.parent_id,
      member: [member],
      ...(children.length > 0 ? { children } : {}),
    }

    return node
  })
}

export function useOfficials() {
  const isMutating = ref(false)
  const searchQuery = ref('')
  const selectedOfficialId = ref<string | null>(null)

  // Fetch relational officials from backend API
  const {
    data: officialsData,
    pending,
    error,
    refresh,
  } = useAsyncData<OfficialRow[]>(
    'elected-officials-list',
    () => $fetch<OfficialRow[]>('/api/elected-officials'),
    { default: () => [] }
  )

  // Fetch available positions
  const {
    data: positionsData,
    refresh: refreshPositions,
  } = useAsyncData<PositionRow[]>(
    'elected-officials-positions',
    () => $fetch<PositionRow[]>('/api/elected-officials/positions'),
    { default: () => [] }
  )

  const rows = computed<OfficialRow[]>(() => officialsData.value || [])
  const positions = computed<PositionRow[]>(() => positionsData.value || [])

  // Build tree hierarchy
  const tree = computed<OfficialNode[]>(() => buildOfficialsTree(rows.value, null))

  // Root node for OrganizationChart
  const treeRoot = computed<OfficialNode | null>(() => {
    if (tree.value.length === 0) return null
    if (tree.value.length === 1) return tree.value[0]!

    // If multiple root officials exist, prefer Mayor if present
    const mayorNode = tree.value.find(
      (n) => n.title.toLowerCase().includes('mayor') && !n.title.toLowerCase().includes('vice')
    )
    if (mayorNode) return mayorNode

    return tree.value[0]!
  })

  // Flat list with enriched display names
  const flatOfficials = computed(() => {
    return rows.value.map((o) => {
      const isLabel = Boolean(o.is_label)
      const labelTitle = o.label_name || o.position?.title || 'Label'
      const fullName = isLabel ? labelTitle : formatOfficialName(o.first_name, o.middle_name, o.last_name)
      const posTitle = o.position?.title || (isLabel ? labelTitle : 'Elected Official')
      const parentOfficial = o.parent_id
        ? rows.value.find((p) => p.id === o.parent_id)
        : null
      const parentName = parentOfficial
        ? (parentOfficial.is_label
            ? (parentOfficial.label_name || parentOfficial.position?.title || 'Section Label')
            : formatOfficialName(parentOfficial.first_name, parentOfficial.middle_name, parentOfficial.last_name))
        : null

      return {
        id: o.id,
        fullName,
        label_name: o.label_name || undefined,
        first_name: o.first_name,
        middle_name: o.middle_name,
        last_name: o.last_name,
        position: posTitle,
        position_id: o.position_id,
        is_label: isLabel,
        rank_order: o.position?.rank_order ?? 99,
        parent_id: o.parent_id,
        parentName,
        contact: o.contact,
        avatar_url: o.avatar_url || o.image_url || undefined,
        image_url: o.avatar_url || o.image_url || undefined,
        created_at: o.created_at,
        updated_at: o.updated_at,
      }
    })
  })

  // Filtered officials highest rank first)
  const filteredOfficials = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    let list = flatOfficials.value.filter((o) => !o.is_label)

    if (q) {
      list = list.filter(
        (o) =>
          o.fullName.toLowerCase().includes(q) ||
          o.position.toLowerCase().includes(q) ||
          (o.contact && o.contact.toLowerCase().includes(q))
      )
    }

    return [...list].sort((a, b) => {
      const rankA = a.rank_order ?? 99
      const rankB = b.rank_order ?? 99
      if (rankA !== rankB) return rankA - rankB
      return (a.last_name || '').localeCompare(b.last_name || '')
    })
  })

  // Selected Official object
  const selectedOfficial = computed(() => {
    if (!selectedOfficialId.value) return null
    return flatOfficials.value.find((o) => o.id === selectedOfficialId.value) || null
  })

  function selectOfficial(id: string | null) {
    selectedOfficialId.value = id
  }

  const stats = computed(() => {
    const list = flatOfficials.value.filter((o) => !o.is_label)
    const total = list.length
    const mayor = list.find((o) => o.position.toLowerCase().includes('mayor') && !o.position.toLowerCase().includes('vice'))
    const viceMayor = list.find((o) => o.position.toLowerCase().includes('vice'))
    const councilors = list.filter(
      (o) =>
        o.position.toLowerCase().includes('sangguniang bayan') ||
        o.position.toLowerCase().includes('councilor') ||
        o.position.toLowerCase().includes('sb member') ||
        o.position.toLowerCase().includes('sb member')
    )

    return {
      total,
      mayorName: mayor?.fullName || 'N/A',
      viceMayorName: viceMayor?.fullName || 'N/A',
      councilorsCount: councilors.length,
    }
  })

  // CRUD Actions
  async function addOfficial(payload: AddOfficialPayload): Promise<OfficialRow> {
    isMutating.value = true
    try {
      const res = await $fetch<OfficialRow>('/api/elected-officials', {
        method: 'POST',
        body: payload,
      })
      await Promise.all([refresh(), refreshPositions()])
      return res
    } catch (err) {
      console.error('Failed to add elected official:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  async function editOfficial(payload: EditOfficialPayload): Promise<OfficialRow> {
    isMutating.value = true
    try {
      const res = await $fetch<OfficialRow>(`/api/elected-officials/${payload.id}`, {
        method: 'PUT',
        body: payload,
      })
      await Promise.all([refresh(), refreshPositions()])
      return res
    } catch (err) {
      console.error('Failed to update elected official:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  async function deleteOfficial(id: string): Promise<boolean> {
    isMutating.value = true
    try {
      await $fetch(`/api/elected-officials/${id}`, {
        method: 'DELETE',
      })
      if (selectedOfficialId.value === id) {
        selectedOfficialId.value = null
      }
      await refresh()
      return true
    } catch (err) {
      console.error('Failed to delete elected official:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  async function uploadOfficialAvatar(file: File): Promise<string> {
    isMutating.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await $fetch<{ success: boolean; publicUrl: string }>('/api/elected-officials/upload', {
        method: 'POST',
        body: formData,
      })

      return res.publicUrl
    } catch (err) {
      console.error('Failed to upload official avatar:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  return {
    rows,
    tree,
    treeRoot,
    positions,
    flatOfficials,
    filteredOfficials,
    selectedOfficialId,
    selectedOfficial,
    selectOfficial,
    searchQuery,
    stats,
    pending,
    isMutating,
    error,
    refresh,
    refreshPositions,
    addOfficial,
    editOfficial,
    deleteOfficial,
    uploadOfficialAvatar,
  }
}
