import { ref, computed } from 'vue'

export interface BarangayPosition {
  id: string
  title: string
  rank_order: number
}

export interface BarangayOfficial {
  id: string
  barangay_id?: string
  parent_id?: string | null
  parentId?: string | null
  name: string
  title: string
  committee?: string
  avatar?: string
  avatar_url?: string
  contact?: string
  order_index?: number
  position_id?: string
  position?: {
    id?: string
    title: string
    rank_order?: number
  }
}

export interface BarangayCoordinates {
  lat: number
  lng: number
  display: string
}

export interface BarangayLandmark {
  id: string
  barangay_id?: string
  name: string
  category: string
  lat: number
  lng: number
  address: string
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
  landmarks?: BarangayLandmark[]
  elected_officials?: { count: number }[]
  barangay_landmark?: { count: number }[]
}

function mapDbOfficial(o: any): BarangayOfficial {
  const posTitle = o.position?.title || o.title || 'Barangay Official'
  const parentId = o.parent_id || o.parentId || null
  return {
    id: o.id,
    barangay_id: o.barangay_id,
    parent_id: parentId,
    parentId: parentId,
    name: o.name,
    title: posTitle,
    committee: o.committee || undefined,
    avatar: o.avatar_url || o.avatar || undefined,
    avatar_url: o.avatar_url || o.avatar || undefined,
    contact: o.contact || undefined,
    order_index: o.order_index ?? o.position?.rank_order ?? 10,
    position_id: o.position_id || o.position?.id || undefined,
    position: o.position ? {
      id: o.position.id,
      title: o.position.title,
      rank_order: o.position.rank_order
    } : undefined
  }
}

function mapDbLandmark(l: any): BarangayLandmark {
  return {
    id: l.id,
    barangay_id: l.barangay_id,
    name: l.name,
    category: l.category || 'Landmark',
    lat: Number(l.lat) || 0,
    lng: Number(l.lng) || 0,
    address: l.address || ''
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

  const landmarks = Array.isArray(db.landmarks)
    ? db.landmarks.map(mapDbLandmark)
    : existing?.landmarks || []

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
    landmarks,
    elected_officials: db.elected_officials,
    barangay_landmark: db.barangay_landmark
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
      const data = await $fetch<any>(`/api/barangay-directory/${id}`)
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

  // CRUD: Create Barangay
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
        currentList[existingIdx] = res
      } else {
        currentList.push(res)
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

  // CRUD: Delete Barangay
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

  // CRUD: Add Official
  const addOfficial = async (barangayId: string, payload: Partial<BarangayOfficial>): Promise<BarangayOfficial> => {
    isMutating.value = true
    try {
      const res = await $fetch<any>(`/api/barangay-directory/${barangayId}/officials`, {
        method: 'POST',
        body: payload
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

  // CRUD: Delete Official
  const deleteOfficial = async (officialId: string, barangayId?: string): Promise<boolean> => {
    isMutating.value = true
    try {
      await $fetch(`/api/barangay-directory/officials/${officialId}`, {
        method: 'DELETE'
      })
      if (barangayId || selectedBarangayId.value) {
        await fetchBarangayById(barangayId || selectedBarangayId.value)
      }
      return true
    } catch (err) {
      console.error(`Failed to delete official '${officialId}':`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  // CRUD: Add Landmark
  const addLandmark = async (barangayId: string, payload: Partial<BarangayLandmark>): Promise<BarangayLandmark> => {
    isMutating.value = true
    try {
      const res = await $fetch<any>(`/api/barangay-directory/${barangayId}/landmarks`, {
        method: 'POST',
        body: payload
      })
      const newLandmark = mapDbLandmark(res)
      await fetchBarangayById(barangayId)
      return newLandmark
    } catch (err) {
      console.error(`Failed to add landmark to barangay '${barangayId}':`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  // CRUD: Delete Landmark
  const deleteLandmark = async (landmarkId: string, barangayId?: string): Promise<boolean> => {
    isMutating.value = true
    try {
      await $fetch(`/api/barangay-directory/landmarks/${landmarkId}`, {
        method: 'DELETE'
      })
      if (barangayId || selectedBarangayId.value) {
        await fetchBarangayById(barangayId || selectedBarangayId.value)
      }
      return true
    } catch (err) {
      console.error(`Failed to delete landmark '${landmarkId}':`, err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

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
    refresh,
    createBarangay,
    updateBarangay,
    deleteBarangay,
    addOfficial,
    updateOfficial,
    deleteOfficial,
    addLandmark,
    deleteLandmark,
    uploadAvatar
  }
}
