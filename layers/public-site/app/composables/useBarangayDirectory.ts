import { ref, computed, watch } from 'vue'

export interface BarangayPosition {
  id: string
  title: string
  rank_order: number
}

export interface BarangayTerm {
  id: string
  label: string
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
}
export type PositionCategory =
  | 'captain' | 'secretary' | 'treasurer'
  | 'sk_chairperson' | 'kagawad' | 'other'
  
export interface BarangayOfficial {
  id: string
  barangay_id?: string
  term_id?: string | null
  parent_id?: string | null
  parentId?: string | null
  is_label?: boolean
  sort_order?: number
  name: string
  position_category?: PositionCategory
  title: string
  committee?: string
  avatar?: string
  avatar_url?: string
  contact?: string
  position_id?: string
   position?: {
    id?: string
    title: string
    rank_order?: number
    position_category: PositionCategory
  }
}

export interface BarangayCoordinates {
  lat: number
  lng: number
  display: string
}

export type BarangayClassification = 'All' | 'Urban' | 'Rural'

export interface BarangayItem {
  id: string
  name: string
  classification: 'Urban' | 'Rural' | string
  postalCode: string
  postal_code?: string
  population: number
  censusYear: string
  census_year?: string
  elevationASL: string
  elevation_asl?: string
  elevationMeters: number
  elevation_meters?: number
  coordinates: BarangayCoordinates
  landAreaSqKm: number
  land_area_sq_km?: number
  hallAddress: string
  hall_address?: string
  contactPhone: string
  contact_phone?: string
  contactEmail: string
  contact_email?: string
  mapEmbedUrl?: string
  map_embed_url?: string
  description?: string
  officials: BarangayOfficial[]
  elected_officials?: { count: number }[]
}

function mapDbOfficial(o: any): BarangayOfficial {
  const posTitle = o.position?.title || o.title || 'Barangay Official'
  const parentId = o.parent_id || o.parentId || null
  return {
    id: o.id,
    barangay_id: o.barangay_id,
    term_id: o.term_id ?? null,
    parent_id: parentId,
    parentId: parentId,
    is_label: o.is_label ?? false,
    sort_order: typeof o.sort_order === 'number' ? o.sort_order : Number(o.sort_order ?? 0),
    name: o.name,
    position_category:o.position_category,
    title: posTitle,
    committee: o.committee || undefined,
    avatar: o.avatar_url || o.avatar || undefined,
    avatar_url: o.avatar_url || o.avatar || undefined,
    contact: o.contact || undefined,
    position_id: o.position_id || o.position?.id || undefined,
    position: o.position ? {
      id: o.position.id,
      title: o.position.title,
      position_category: o.position.position_category,
      rank_order: o.position.rank_order
    } : undefined
  }
}

function mapDbBarangayToItem(
  db: any, 
  existing?: BarangayItem
): BarangayItem {
  const lat = Number(db.lat ?? db.coordinates?.lat ?? existing?.coordinates?.lat ?? 0)
  const lng = Number(db.lng ?? db.coordinates?.lng ?? existing?.coordinates?.lng ?? 0)
  const display = db.coordinates_display || db.coordinates?.display || existing?.coordinates?.display || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`

  const officials = Array.isArray(db.officials)
    ? db.officials.map(mapDbOfficial)
    : existing?.officials || []

  const rawClassification = db.classification || existing?.classification || 'Rural'
  const classification = rawClassification === 'Poblacion' ? 'Urban' : rawClassification

  return {
    id: db.id,
    name: db.name,
    classification,
    postalCode: String(db.postal_code || db.postalCode || existing?.postalCode || '8501'),
    postal_code: String(db.postal_code || db.postalCode || existing?.postalCode || '8501'),
    population: Number(db.population ?? existing?.population ?? 0),
    censusYear: String(db.census_year || db.censusYear || existing?.censusYear || '2024'),
    census_year: String(db.census_year || db.censusYear || existing?.censusYear || '2024'),
    elevationASL: String(db.elevation_asl || db.elevationASL || existing?.elevationASL || '0m ASL'),
    elevation_asl: String(db.elevation_asl || db.elevationASL || existing?.elevationASL || '0m ASL'),
    elevationMeters: Number(db.elevation_meters ?? db.elevationMeters ?? existing?.elevationMeters ?? 0),
    elevation_meters: Number(db.elevation_meters ?? db.elevationMeters ?? existing?.elevationMeters ?? 0),
    coordinates: { lat, lng, display },
    landAreaSqKm: Number(db.land_area_sq_km ?? db.landAreaSqKm ?? existing?.landAreaSqKm ?? 0),
    land_area_sq_km: Number(db.land_area_sq_km ?? db.landAreaSqKm ?? existing?.landAreaSqKm ?? 0),
    hallAddress: String(db.hall_address || db.hallAddress || existing?.hallAddress || ''),
    hall_address: String(db.hall_address || db.hallAddress || existing?.hallAddress || ''),
    contactPhone: String(db.contact_phone || db.contactPhone || existing?.contactPhone || ''),
    contact_phone: String(db.contact_phone || db.contactPhone || existing?.contactPhone || ''),
    contactEmail: String(db.contact_email || db.contactEmail || existing?.contactEmail || ''),
    contact_email: String(db.contact_email || db.contactEmail || existing?.contactEmail || ''),
    mapEmbedUrl: db.map_embed_url || db.mapEmbedUrl || existing?.mapEmbedUrl,
    map_embed_url: db.map_embed_url || db.mapEmbedUrl || existing?.mapEmbedUrl,
    description: db.description || existing?.description || '',
    officials,
    elected_officials: db.elected_officials
  }
}

export function useBarangayDirectory() {
  const searchQuery = useState<string>('brgy-dir-search-query', () => '')
  const selectedClassification = useState<BarangayClassification>('brgy-dir-classification', () => 'All')
  const selectedBarangayId = useState<string>('brgy-dir-selected-id', () => '')
  const isMutating = useState<boolean>('brgy-dir-is-mutating', () => false)
  const isDynamicSource = useState<boolean>('brgy-dir-is-dynamic', () => true)
  const barangaysMap = useState<Record<string, BarangayItem>>('brgy-dir-details-map', () => ({}))
  const barangaysList = useState<any[]>('brgy-dir-raw-list', () => [])

  // Fetch all barangays dynamically from Supabase API via useAsyncData (runs on SSR & client)
  const {
    data: barangaysData,
    pending: isLoading,
    error,
    refresh: refreshBarangays
  } = useAsyncData<any[]>(
    'barangay-directory-list',
    async () => {
      try {
        const data = await $fetch<any[]>('/api/barangay-directory')
        if (Array.isArray(data)) {
          barangaysList.value = data
        }
        return data || []
      } catch (e) {
        return barangaysList.value
      }
    },
    { default: () => barangaysList.value }
  )

  // Dynamic mapped list of barangays
  const barangays = computed<BarangayItem[]>(() => {
    const raw = barangaysData.value && barangaysData.value.length > 0
      ? barangaysData.value
      : barangaysList.value

    return raw.map(dbRow => {
      const detailed = barangaysMap.value[dbRow.id]
      return mapDbBarangayToItem(dbRow, detailed)
    })
  })

  // Available positions
  const {
    data: positionsData,
    refresh: refreshPositions
  } = useAsyncData<BarangayPosition[]>(
    'barangay-directory-positions',
    () => $fetch<BarangayPosition[]>('/api/barangay-directory/positions'),
    { default: () => [] }
  )

  const positions = computed<BarangayPosition[]>(() => positionsData.value || [])

  // Shared terms (e.g. 2020-2023, 2023-2026) reused across every barangay.
  const selectedTermId = useState<string>('brgy-dir-selected-term', () => '')

  const {
    data: termsData,
    refresh: refreshTerms
  } = useAsyncData<BarangayTerm[]>(
    'barangay-directory-terms',
    () => $fetch<BarangayTerm[]>('/api/barangay-directory/terms'),
    { default: () => [] }
  )

  const terms = computed<BarangayTerm[]>(() => termsData.value || [])

  const currentTerm = computed<BarangayTerm | undefined>(
    () => terms.value.find(t => t.is_current) || terms.value[0]
  )

  const selectedTerm = computed<BarangayTerm | undefined>(
    () => terms.value.find(t => t.id === selectedTermId.value) || currentTerm.value
  )

  // Keep the selection valid: default to the current term whenever the current
  // selection isn't present (first load, or after a term was deleted).
  watch(
    terms,
    (list) => {
      if (list.length && !list.some(t => t.id === selectedTermId.value)) {
        selectedTermId.value = (list.find(t => t.is_current) || list[0])!.id
      }
    },
    { immediate: true }
  )

  // Auto-resolve active barangay ID
  const activeId = computed(() => {
    if (selectedBarangayId.value) return selectedBarangayId.value
    return barangays.value[0]?.id || ''
  })

  const selectedBarangay = computed<BarangayItem | undefined>(() => {
    if (barangays.value.length === 0) return undefined
    const found = barangays.value.find(b => b.id === activeId.value)
    return found || barangays.value[0]
  })

  const filteredBarangays = computed<BarangayItem[]>(() => {
    return barangays.value.filter(b => {
      const q = searchQuery.value.trim().toLowerCase()
      const matchesSearch = q === '' || 
        b.name.toLowerCase().includes(q) ||
        (b.postalCode && b.postalCode.includes(q)) ||
        (b.officials && b.officials.some(o => o.name.toLowerCase().includes(q) || (o.title && o.title.toLowerCase().includes(q))))

      const matchesClass = selectedClassification.value === 'All' || 
        b.classification === selectedClassification.value

      return matchesSearch && matchesClass
    })
  })

  const totalPopulation = computed(() => {
    return barangays.value.reduce((acc, curr) => acc + (curr.population || 0), 0)
  })

  const classificationCounts = computed(() => {
    const list = barangays.value
    return {
      all: list.length,
      urban: list.filter(b => b.classification === 'Urban').length,
      rural: list.filter(b => b.classification === 'Rural').length
    }
  })

  const isLoadingDetails = ref(false)

  // Fetch detailed single barangay from Supabase API (with officials & landmarks)
  const fetchBarangayById = async (id: string): Promise<BarangayItem | undefined> => {
    if (!id) return undefined
    isLoadingDetails.value = true
    try {
      const data = await $fetch<any>(`/api/barangay-directory/${id}`, {
        query: selectedTermId.value ? { term: selectedTermId.value } : undefined
      })
      if (data && data.id) {
        const item = mapDbBarangayToItem(data)
        barangaysMap.value[id] = item
        return item
      }
    } catch (err) {
      console.error(`Failed to fetch details for barangay '${id}' from Supabase:`, err)
    } finally {
      isLoadingDetails.value = false
    }
    return selectedBarangay.value
  }

  const selectBarangay = async (id: string) => {
    selectedBarangayId.value = id
    const cached = barangaysMap.value[id]
    if (!cached || !cached.officials || cached.officials.length === 0) {
      await fetchBarangayById(id)
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setClassification = (classification: BarangayClassification) => {
    selectedClassification.value = classification
  }

  const setDynamicBarangays = (data: BarangayItem[]) => {
    if (data && Array.isArray(data)) {
      barangaysData.value = data
      barangaysList.value = data
      data.forEach(item => {
        barangaysMap.value[item.id] = item
      })
      isDynamicSource.value = true
    }
  }

  const fetchBarangays = async () => {
    await refreshBarangays()
    return barangays.value
  }

  const fetchPositions = async () => {
    await refreshPositions()
    return positions.value
  }

  const fetchTerms = async () => {
    await refreshTerms()
    return terms.value
  }

  // Switch the active term. Officials are term-scoped, so cached barangay
  // details are stale after a switch and must be refetched.
  const selectTerm = async (termId: string) => {
    if (!termId || termId === selectedTermId.value) return
    selectedTermId.value = termId
    barangaysMap.value = {}
    if (activeId.value) {
      await fetchBarangayById(activeId.value)
    }
  }

  const createTerm = async (payload: Partial<BarangayTerm>): Promise<BarangayTerm> => {
    isMutating.value = true
    try {
      const res = await $fetch<BarangayTerm>('/api/barangay-directory/terms', {
        method: 'POST',
        body: payload
      })
      await refreshTerms()
      // Jump to the freshly created term so officials can be added into it.
      if (res?.id) {
        selectedTermId.value = res.id
        barangaysMap.value = {}
        if (activeId.value) await fetchBarangayById(activeId.value)
      }
      return res
    } catch (err) {
      console.error('Failed to create term:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  const updateTerm = async (id: string, payload: Partial<BarangayTerm>): Promise<BarangayTerm> => {
    isMutating.value = true
    try {
      const res = await $fetch<BarangayTerm>(`/api/barangay-directory/terms/${id}`, {
        method: 'PUT',
        body: payload
      })
      await refreshTerms()
      return res
    } catch (err) {
      console.error(`Failed to update term '${id}':`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  const deleteTerm = async (id: string): Promise<boolean> => {
    isMutating.value = true
    try {
      await $fetch(`/api/barangay-directory/terms/${id}`, { method: 'DELETE' })
      await refreshTerms()
      // If the deleted term was active, the watcher resets the selection; make
      // sure the officials for the new selection are loaded.
      barangaysMap.value = {}
      if (activeId.value) await fetchBarangayById(activeId.value)
      return true
    } catch (err) {
      console.error(`Failed to delete term '${id}':`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  const createBarangay = async (payload: Partial<BarangayItem>): Promise<BarangayItem> => {
    isMutating.value = true
    try {
      const res = await $fetch<any>('/api/barangay-directory', {
        method: 'POST',
        body: payload
      })
      const newItem = mapDbBarangayToItem(res)
      barangaysMap.value[newItem.id] = newItem

      const currentList = Array.isArray(barangaysData.value) ? [...barangaysData.value] : [...barangaysList.value]
      const existingIdx = currentList.findIndex(b => b.id === newItem.id)
      if (existingIdx !== -1) {
        currentList[existingIdx] = newItem
      } else {
        currentList.push(newItem)
      }
      barangaysData.value = currentList
      barangaysList.value = currentList
      selectedBarangayId.value = newItem.id
      return newItem
    } catch (err) {
      console.error('Failed to create barangay in Supabase:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }
  // CRUD: Update Barangay
  const updateBarangay = async (id: string, payload: Partial<BarangayItem>): Promise<BarangayItem> => {
    isMutating.value = true
    try {
      const res = await $fetch<any>(`/api/barangay-directory/${id}`, {
        method: 'PUT',
        body: payload
      })
      const updatedItem = mapDbBarangayToItem(res, barangaysMap.value[id])
      barangaysMap.value[id] = updatedItem

      const currentList = Array.isArray(barangaysData.value) ? [...barangaysData.value] : [...barangaysList.value]
      const idx = currentList.findIndex(b => b.id === id)
      if (idx !== -1) {
        currentList[idx] = { ...currentList[idx], ...res }
        barangaysData.value = currentList
        barangaysList.value = currentList
      }
      return updatedItem
    } catch (err) {
      console.error(`Failed to update barangay '${id}' in Supabase:`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  const deleteBarangay = async (id: string): Promise<boolean> => {
    isMutating.value = true
    try {
      await $fetch(`/api/barangay-directory/${id}`, {
        method: 'DELETE'
      })
      delete barangaysMap.value[id]

      const currentList = Array.isArray(barangaysData.value) ? [...barangaysData.value] : [...barangaysList.value]
      const filtered = currentList.filter(b => b.id !== id)
      barangaysData.value = filtered
      barangaysList.value = filtered

      if (selectedBarangayId.value === id && filtered.length > 0) {
        selectedBarangayId.value = filtered[0]!.id
      }
      return true
    } catch (err) {
      console.error(`Failed to delete barangay '${id}' from Supabase:`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  //Add Official
  const addOfficial = async (barangayId: string, payload: Partial<BarangayOfficial>): Promise<BarangayOfficial> => {
    isMutating.value = true
    try {
      // Officials are created within whichever term is currently selected.
      const res = await $fetch<any>(`/api/barangay-directory/${barangayId}/officials`, {
        method: 'POST',
        body: { ...payload, term_id: payload.term_id || selectedTermId.value || undefined }
      })
      const newOfficial = mapDbOfficial(res)
      await fetchBarangayById(barangayId)
      return newOfficial
    } catch (err) {
      console.error(`Failed to add official to barangay '${barangayId}':`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  // CRUD: Update Official
  const updateOfficial = async (officialId: string, payload: Partial<BarangayOfficial>, barangayId?: string): Promise<BarangayOfficial> => {
    isMutating.value = true
    try {
      const res = await $fetch<any>(`/api/barangay-directory/officials/${officialId}`, {
        method: 'PUT',
        body: payload
      })
      const updatedOfficial = mapDbOfficial(res)
      if (barangayId || selectedBarangayId.value) {
        await fetchBarangayById(barangayId || selectedBarangayId.value)
      }
      return updatedOfficial
    } catch (err) {
      console.error(`Failed to update official '${officialId}':`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  const deleteOfficial = async (id: string, barangayId?: string): Promise<boolean> => {
    isMutating.value = true
    try {
      await $fetch<any>(`/api/barangay-directory/officials/${id}`, {
        method: 'DELETE'
      })
      if (barangayId || selectedBarangayId.value) {
        await fetchBarangayById(barangayId || selectedBarangayId.value)
      }
      return true
    } catch (err) {
      console.error(`Failed to delete official '${id}':`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  // CRUD: Reorder Officials (persist sibling display order)
  // orderedIds is the sibling ids in their new top-to-bottom order.
  const reorderOfficials = async (barangayId: string, orderedIds: string[]): Promise<boolean> => {
    if (!barangayId || !Array.isArray(orderedIds) || orderedIds.length === 0) return false
    isMutating.value = true
    try {
      const items = orderedIds.map((id, index) => ({ id, sort_order: index }))
      await $fetch('/api/barangay-directory/officials/reorder', {
        method: 'PUT',
        body: { barangayId, items }
      })
      await fetchBarangayById(barangayId)
      return true
    } catch (err) {
      console.error('Failed to reorder officials:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  // CRUD: Add Landmark
  // CRUD: Upload Avatar
  const uploadAvatar = async (file: File): Promise<string> => {
    isMutating.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await $fetch<{ success: boolean; publicUrl: string }>('/api/barangay-directory/upload', {
        method: 'POST',
        body: formData
      })
      return res.publicUrl
    } catch (err) {
      console.error('Failed to upload official avatar:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  const refresh = async () => {
    await refreshBarangays()
    if (activeId.value) {
      await fetchBarangayById(activeId.value)
    }
  }

  return {
    searchQuery,
    selectedClassification,
    selectedBarangayId,
    isLoading,
    isLoadingDetails,
    isMutating,
    isDynamicSource,
    error,
    barangays,
    positions,
    terms,
    selectedTerm,
    selectedTermId,
    currentTerm,
    selectedBarangay,
    filteredBarangays,
    totalPopulation,
    classificationCounts,
    selectBarangay,
    setSearchQuery,
    setClassification,
    setDynamicBarangays,
    fetchBarangays,
    fetchBarangayById,
    fetchPositions,
    fetchTerms,
    selectTerm,
    createTerm,
    updateTerm,
    deleteTerm,
    refresh,
    createBarangay,
    updateBarangay,
    deleteBarangay,
    addOfficial,
    updateOfficial,
    deleteOfficial,
    reorderOfficials,
    uploadAvatar
  }
}
