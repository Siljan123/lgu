import { ref, computed, watch } from 'vue'
import rawCoordinatesData from '../../coordinates.json'

export interface Establishment {
  id: string
  name: string
  category: string
  address: string
  contactNo?: string
  barangay: string
  operatingHours?: string
  description?: string
  coordinates: { lat: number; lng: number }
  image?: string
  photoUrls?: string[]
}

// Dynamically format raw JSON categories into clean, readable labels (e.g. COFFEE_SHOP -> Coffee Shop)
export function formatCategoryLabel(rawCat: string): string {
  if (!rawCat) return 'Other Services'
  const upper = rawCat.trim().toUpperCase()
  if (upper === 'ATMS') return 'ATMs'
  return rawCat
    .trim()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Extract all unique categories dynamically from coordinates.json
export const DYNAMIC_CATEGORIES: string[] = Array.from(
  new Set(
    rawCoordinatesData
      .map((item: any) => formatCategoryLabel(item.category || ''))
      .filter(Boolean)
  )
).sort()

function extractPhone(address: string): string | undefined {
  if (!address) return undefined
  const match = address.match(/(09\d{9}|\(085\)\s*\d{3}-\d{4})/i)
  return match ? match[0] : undefined
}

export const useWhereToStayEat = () => {
  const searchQuery = ref('')
  // Default category is 'All'
  const selectedCategory = ref<string>('All')
  const selectedBarangay = ref<string>('All')
  // Default first render view to 'grid' (Card View)
  const viewMode = ref<'grid' | 'table'>('grid')
  const activeEstablishmentId = ref<string | null>(null)

  // Pagination states
  const currentPage = ref(1)
  const itemsPerPage = ref(9)

  // Map 100% of coordinates.json dynamically into structured Establishment objects
  const establishmentsData: Establishment[] = rawCoordinatesData.map((item: any) => {
    const formattedCat = formatCategoryLabel(item.category || '')
    const phone = extractPhone(item.short_description || '')
    const addressStr = item.short_description || 'San Francisco, Agusan del Sur'

    let hours: string | undefined = undefined
    if (item.opening && item.closing) {
      hours = `${item.opening} - ${item.closing}`
    }

    return {
      id: item.id || `json-${item.lat}-${item.lng}`,
      name: item.name,
      category: formattedCat,
      address: addressStr,
      contactNo: phone,
      barangay: addressStr,
      operatingHours: hours,
      coordinates: { lat: item.lat, lng: item.lng },
      image: item.photoUrls && item.photoUrls.length > 0 ? item.photoUrls[0] : undefined,
      photoUrls: item.photoUrls || []
    }
  })

  // Dynamic unique barangays list
  const barangays = computed(() => {
    const set = new Set(establishmentsData.map(e => e.barangay))
    return ['All', ...Array.from(set).sort()]
  })

  // Dynamic category counts map directly calculated from coordinates.json
  const categoryCounts = computed(() => {
    const map: Record<string, number> = { All: establishmentsData.length }
    DYNAMIC_CATEGORIES.forEach(cat => { map[cat] = 0 })
    establishmentsData.forEach(item => {
      if (map[item.category] !== undefined) {
        map[item.category]++
      } else {
        map[item.category] = 1
      }
    })
    return map
  })

  // Dynamically filtered establishments list based on search and category
  const filteredEstablishments = computed(() => {
    return establishmentsData.filter(item => {
      const matchesCategory = selectedCategory.value === 'All'
        || item.category === selectedCategory.value

      const matchesBarangay = selectedBarangay.value === 'All'
        || item.barangay === selectedBarangay.value

      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch = !query
        || item.name.toLowerCase().includes(query)
        || item.address.toLowerCase().includes(query)
        || item.category.toLowerCase().includes(query)
        || (item.contactNo && item.contactNo.includes(query))

      return matchesCategory && matchesBarangay && matchesSearch
    })
  })

  // Reset page to 1 synchronously whenever filters or search query change
  watch([selectedCategory, selectedBarangay, searchQuery], () => {
    currentPage.value = 1
  }, { flush: 'sync' })

  // Paginated subset of filtered establishments
  const paginatedEstablishments = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredEstablishments.value.slice(start, end)
  })

  const selectedEstablishment = computed(() => {
    if (!activeEstablishmentId.value) return null
    return establishmentsData.find(e => e.id === activeEstablishmentId.value) || null
  })

  const mapMarkers = computed(() => {
    return filteredEstablishments.value
      .filter(item => item.coordinates)
      .map(item => ({
        address: item.address,
        title: `${item.name} (${item.category})`,
        position: { lat: item.coordinates.lat, lng: item.coordinates.lng }
      }))
  })

  const selectCategory = (cat: string) => {
    selectedCategory.value = cat
  }

  const selectBarangay = (brgy: string) => {
    selectedBarangay.value = brgy
  }

  const selectEstablishment = (itemOrId: Establishment | string | null) => {
    if (!itemOrId) {
      activeEstablishmentId.value = null
    } else if (typeof itemOrId === 'string') {
      activeEstablishmentId.value = itemOrId
    } else {
      activeEstablishmentId.value = itemOrId.id
    }
  }

  return {
    establishmentsData,
    categories: DYNAMIC_CATEGORIES,
    barangays,
    categoryCounts,
    searchQuery,
    selectedCategory,
    selectedBarangay,
    viewMode,
    currentPage,
    itemsPerPage,
    activeEstablishmentId,
    selectedEstablishment,
    filteredEstablishments,
    paginatedEstablishments,
    mapMarkers,
    selectCategory,
    selectBarangay,
    selectEstablishment
  }
}
