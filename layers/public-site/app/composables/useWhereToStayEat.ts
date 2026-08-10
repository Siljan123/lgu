import { ref, computed, watch } from 'vue'
import rawCoordinatesData from '../../coordinates.json'

export type MainCategory = 'Where to Stay' | 'Where to Eat'
export type StaySubCategory = 'Hotels' | 'Inns / lodges' | 'Homestays' | 'Resorts'
export type EatSubCategory = 'Restaurants' | 'Eateries / carinderias' | 'Cafes' | 'Local food stalls'
export type SubCategory = StaySubCategory | EatSubCategory

export interface Establishment {
  id: string
  name: string
  mainCategory: MainCategory
  subCategory: SubCategory
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

export const MAIN_CATEGORIES: MainCategory[] = ['Where to Stay', 'Where to Eat']

export const STAY_SUBCATEGORIES: StaySubCategory[] = [
  'Hotels',
  'Inns / lodges',
  'Homestays',
  'Resorts'
]

export const EAT_SUBCATEGORIES: EatSubCategory[] = [
  'Restaurants',
  'Eateries / carinderias',
  'Cafes',
  'Local food stalls'
]

export const ALL_SUBCATEGORIES: SubCategory[] = [
  ...STAY_SUBCATEGORIES,
  ...EAT_SUBCATEGORIES
]

export function classifyEstablishment(rawCat: string, name: string = ''): { mainCategory: MainCategory; subCategory: SubCategory } | null {
  const cat = (rawCat || '').trim().toUpperCase()
  const lowerName = (name || '').toLowerCase()

  // Match raw coordinates.json categories
  if (cat === 'HOMESTAYS') {
    return { mainCategory: 'Where to Stay', subCategory: 'Homestays' }
  }
  if (cat === 'INDLAND_RESORTS') {
    return { mainCategory: 'Where to Stay', subCategory: 'Resorts' }
  }
  if (cat === 'MABUHAY_ACCOMMODATIONS') {
    if (lowerName.includes('hotel')) {
      return { mainCategory: 'Where to Stay', subCategory: 'Hotels' }
    }
    if (lowerName.includes('resort')) {
      return { mainCategory: 'Where to Stay', subCategory: 'Resorts' }
    }
    if (lowerName.includes('homestay')) {
      return { mainCategory: 'Where to Stay', subCategory: 'Homestays' }
    }
    return { mainCategory: 'Where to Stay', subCategory: 'Inns / lodges' }
  }

  if (cat === 'COFFEE_SHOP') {
    return { mainCategory: 'Where to Eat', subCategory: 'Cafes' }
  }
  if (cat === 'RESTAURANTS') {
    return { mainCategory: 'Where to Eat', subCategory: 'Restaurants' }
  }
  if (cat === 'FASTFOOD') {
    if (
      lowerName.includes('eatery') ||
      lowerName.includes('carinderia') ||
      lowerName.includes('kitchenette') ||
      lowerName.includes('kambingan') ||
      lowerName.includes('tapsi')
    ) {
      return { mainCategory: 'Where to Eat', subCategory: 'Eateries / carinderias' }
    }
    if (
      lowerName.includes('burger') ||
      lowerName.includes('stall') ||
      lowerName.includes('kiosk') ||
      lowerName.includes('roaster') ||
      lowerName.includes('bbq') ||
      lowerName.includes('barbecue') ||
      lowerName.includes('treats')
    ) {
      return { mainCategory: 'Where to Eat', subCategory: 'Local food stalls' }
    }
    return { mainCategory: 'Where to Eat', subCategory: 'Eateries / carinderias' }
  }

  // Friendly category string fallbacks (e.g. for mock objects in unit tests)
  if (cat.includes('HOTEL')) {
    return { mainCategory: 'Where to Stay', subCategory: 'Hotels' }
  }
  if (cat.includes('INN') || cat.includes('LODGE') || cat.includes('MABUHAY')) {
    return { mainCategory: 'Where to Stay', subCategory: 'Inns / lodges' }
  }
  if (cat.includes('HOMESTAY')) {
    return { mainCategory: 'Where to Stay', subCategory: 'Homestays' }
  }
  if (cat.includes('RESORT')) {
    return { mainCategory: 'Where to Stay', subCategory: 'Resorts' }
  }
  if (cat.includes('RESTAURANT')) {
    return { mainCategory: 'Where to Eat', subCategory: 'Restaurants' }
  }
  if (cat.includes('CAFE') || cat.includes('COFFEE')) {
    return { mainCategory: 'Where to Eat', subCategory: 'Cafes' }
  }
  if (cat.includes('EATERY') || cat.includes('CARINDERIA') || cat.includes('FASTFOOD')) {
    return { mainCategory: 'Where to Eat', subCategory: 'Eateries / carinderias' }
  }
  if (cat.includes('STALL')) {
    return { mainCategory: 'Where to Eat', subCategory: 'Local food stalls' }
  }

  return null
}

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

function extractPhone(address: string): string | undefined {
  if (!address) return undefined
  const match = address.match(/(09\d{9}|\(085\)\s*\d{3}-\d{4})/i)
  return match ? match[0] : undefined
}

export const useWhereToStayEat = () => {
  const searchQuery = ref('')
  const selectedMainCategory = ref<string>('All')
  const selectedSubCategory = ref<string>('All')
  const selectedBarangay = ref<string>('All')
  const viewMode = ref<'grid' | 'table'>('grid')
  const activeEstablishmentId = ref<string | null>(null)

  const currentPage = ref(1)
  const itemsPerPage = ref(9)

  // Map coordinates.json entries belonging to Where to Stay or Where to Eat
  const establishmentsData: Establishment[] = rawCoordinatesData
    .map((item: any) => {
      const classification = classifyEstablishment(item.category || '', item.name || '')
      if (!classification) return null

      const phone = extractPhone(item.short_description || '')
      const addressStr = item.short_description || 'San Francisco, Agusan del Sur'

      let hours: string | undefined = undefined
      if (item.opening && item.closing) {
        hours = `${item.opening} - ${item.closing}`
      }

      return {
        id: item.id || `json-${item.lat}-${item.lng}`,
        name: item.name,
        mainCategory: classification.mainCategory,
        subCategory: classification.subCategory,
        category: classification.subCategory,
        address: addressStr,
        contactNo: phone,
        barangay: addressStr,
        operatingHours: hours,
        coordinates: { lat: item.lat, lng: item.lng },
        image: item.photoUrls && item.photoUrls.length > 0 ? item.photoUrls[0] : undefined,
        photoUrls: item.photoUrls || []
      }
    })
    .filter((e): e is Establishment => e !== null)

  const subCategories = computed(() => {
    if (selectedMainCategory.value === 'Where to Stay') {
      return STAY_SUBCATEGORIES
    }
    if (selectedMainCategory.value === 'Where to Eat') {
      return EAT_SUBCATEGORIES
    }
    return ALL_SUBCATEGORIES
  })

  // Dynamic unique barangays list
  const barangays = computed(() => {
    const set = new Set(establishmentsData.map(e => e.barangay))
    return ['All', ...Array.from(set).sort()]
  })

  // Counts for main categories and subcategories
  const mainCategoryCounts = computed(() => {
    const counts: Record<string, number> = {
      All: establishmentsData.length,
      'Where to Stay': 0,
      'Where to Eat': 0
    }
    establishmentsData.forEach(item => {
      if (counts[item.mainCategory] !== undefined) {
        counts[item.mainCategory]++
      }
    })
    return counts
  })

  const categoryCounts = computed(() => {
    const counts: Record<string, number> = { All: establishmentsData.length }
    ALL_SUBCATEGORIES.forEach(sc => { counts[sc] = 0 })
    counts['Where to Stay'] = mainCategoryCounts.value['Where to Stay']
    counts['Where to Eat'] = mainCategoryCounts.value['Where to Eat']

    establishmentsData.forEach(item => {
      counts[item.subCategory] = (counts[item.subCategory] || 0) + 1
    })
    return counts
  })

  // Dynamically filtered establishments list based on main category, subcategory, barangay, and search
  const filteredEstablishments = computed(() => {
    return establishmentsData.filter(item => {
      const matchesMainCat =
        selectedMainCategory.value === 'All' ||
        item.mainCategory === selectedMainCategory.value

      const matchesSubCat =
        selectedSubCategory.value === 'All' ||
        item.subCategory === selectedSubCategory.value ||
        item.category === selectedSubCategory.value

      const matchesBarangay =
        selectedBarangay.value === 'All' ||
        item.barangay === selectedBarangay.value

      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.address.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.subCategory.toLowerCase().includes(query) ||
        item.mainCategory.toLowerCase().includes(query) ||
        (item.contactNo && item.contactNo.includes(query))

      return matchesMainCat && matchesSubCat && matchesBarangay && matchesSearch
    })
  })

  // Selected category backward compatibility proxy
  const selectedCategory = computed({
    get: () => {
      if (selectedSubCategory.value !== 'All') return selectedSubCategory.value
      return selectedMainCategory.value
    },
    set: (val: string) => {
      if (val === 'All') {
        selectedMainCategory.value = 'All'
        selectedSubCategory.value = 'All'
      } else if (val === 'Where to Stay' || val === 'Where to Eat') {
        selectedMainCategory.value = val
        selectedSubCategory.value = 'All'
      } else {
        // Find if val belongs to stay or eat
        if (STAY_SUBCATEGORIES.includes(val as any)) {
          selectedMainCategory.value = 'Where to Stay'
          selectedSubCategory.value = val
        } else if (EAT_SUBCATEGORIES.includes(val as any)) {
          selectedMainCategory.value = 'Where to Eat'
          selectedSubCategory.value = val
        } else {
          selectedSubCategory.value = val
        }
      }
    }
  })

  // Reset page to 1 synchronously whenever filters or search query change
  watch([selectedMainCategory, selectedSubCategory, selectedBarangay, searchQuery], () => {
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
        title: `${item.name} (${item.subCategory})`,
        position: { lat: item.coordinates.lat, lng: item.coordinates.lng }
      }))
  })

  const selectMainCategory = (mainCat: string) => {
    selectedMainCategory.value = mainCat
    selectedSubCategory.value = 'All'
  }

  const selectSubCategory = (subCat: string) => {
    selectedSubCategory.value = subCat
  }

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
    categories: subCategories,
    mainCategories: ['All', ...MAIN_CATEGORIES],
    subCategories,
    staySubCategories: STAY_SUBCATEGORIES,
    eatSubCategories: EAT_SUBCATEGORIES,
    barangays,
    categoryCounts,
    mainCategoryCounts,
    searchQuery,
    selectedMainCategory,
    selectedSubCategory,
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
    selectMainCategory,
    selectSubCategory,
    selectCategory,
    selectBarangay,
    selectEstablishment
  }
}
