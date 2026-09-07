import { ref, computed, watch } from 'vue'
import rawCoordinates from '../../coordinates.json'

export interface Destination {
  id: string
  name: string
  category: string
  secondaryCategory?: string
  barangay: string
  shortDescription: string
  churchfullDescription: string
  sportsfullDescription: string
  resortfullDescription: string
  mallsfullDescription: string
  highlights: string[]
  howToGetThere: string
  bestTimeToVisit: string
  accessNotes: string
  image: string
  photoUrls?: string[]
  coordinates?: { lat: number; lng: number }
  opening?: string
  closing?: string
}

interface CoordinateItem {
  id: string
  category: string
  name: string
  short_description: string
  lat: number
  lng: number
  photoUrls?: string[]
  opening?: string
  closing?: string
}

export interface LandmarkOption {
  id: string
  name: string
  category: string
  barangay: string
  coordinates: { lat: number; lng: number }
  type: 'bank' | 'terminal' | 'resort' | 'church' | 'mall' | 'civic' | 'other'
}

export async function fetchCoordinatesData(apiUrl?: string): Promise<CoordinateItem[]> {
  if (apiUrl) {
    try {
      const data = await $fetch<CoordinateItem[]>(apiUrl)
      if (Array.isArray(data) && data.length > 0) return data
    } catch (err) {
      console.warn(`Coordinates API request to "${apiUrl}" failed, falling back to coordinates.json:`, err)
    }
  }
  return rawCoordinates as CoordinateItem[]
}

export const useDestinations = () => {
  const searchQuery = ref('')
  const selectedCategory = ref<string>('All')
  const activeDestinationId = ref<string | null>(null)
  const viewMode = ref<'grid' | 'map'>('grid')
  const currentPage = ref(1)
  const pageSize = ref(6)

  // Route Planning State
  const routeOriginId = ref<string | null>(null)
  const routeDestinationId = ref<string | null>(null)
  const routeTravelMode = ref<'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT'>('DRIVING')

  // Watch search and category to reset pagination to page 1
  watch([searchQuery, selectedCategory], () => {
    currentPage.value = 1
  })

  // All landmarks from coordinates.json formatted as selectable origin/destination options
  const allLandmarkOptions: LandmarkOption[] = (rawCoordinates as CoordinateItem[])
    .filter(item => typeof item.lat === 'number' && typeof item.lng === 'number')
    .map(item => {
      let type: LandmarkOption['type'] = 'other'
      if (item.category === 'ATMS') type = 'bank'
      else if (item.category.includes('TERMINAL') || item.name.toLowerCase().includes('terminal')) type = 'terminal'
      else if (item.category === 'INDLAND_RESORTS' || item.category === 'HOMESTAYS' || item.category === 'MABUHAY_ACCOMMODATIONS') type = 'resort'
      else if (item.category === 'Church') type = 'church'
      else if (item.category === 'MALLS') type = 'mall'
      else if (item.category === 'BARANGAY_HALL' || item.category === 'GOVERNMENT_OFFICES') type = 'civic'

      const brgyMatch = item.short_description.match(/(?:Barangay|Brgy\.?|Purok)\s+([A-Za-z0-9\s]+?)(?:,|$)/i)
      const barangay = brgyMatch ? brgyMatch[1]!.trim() : 'San Francisco'

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        barangay,
        coordinates: { lat: item.lat, lng: item.lng },
        type
      }
    })

  const destinationCategories = [
    'INDLAND_RESORTS',
    'Church',
    'PALARONG_PAMBANSA',
    'MALLS'
  ]

  const destinationsData: Destination[] = (rawCoordinates as CoordinateItem[])
    .filter(item => destinationCategories.includes(item.category))
    .map(item => {
      let mappedCategory = 'Natural Attractions'
      if (item.category === 'INDLAND_RESORTS') mappedCategory = 'Day-Tour Resorts / Swimming Spots'
      else if (item.category === 'Church') mappedCategory = 'Churches & Religious Landmarks'
      else if (item.category === 'PALARONG_PAMBANSA') mappedCategory = 'Sports & Recreation Facilities'
      else if (item.category === 'MALLS') mappedCategory = 'Malls/Business establishments'

      const brgyMatch = item.short_description.match(/(?:Barangay|Brgy\.?|Purok)\s+([A-Za-z0-9\s]+?)(?:,|$)/i)
      const barangay = brgyMatch ? brgyMatch[1]!.trim() : 'San Francisco'

      const photoList = item.photoUrls && item.photoUrls.length > 0
        ? item.photoUrls
        : []

      const image = photoList[0] || ''

      return {
        id: item.id,
        name: item.name,
        category: mappedCategory,
        secondaryCategory: item.category,
        barangay,
        shortDescription: item.short_description,
        churchfullDescription: `${item.name} is a notable religious and cultural landmark located in ${item.short_description}. It serves as a place of worship, reflection, and community gatherings, while also representing an important part of the area's local heritage and traditions. The landmark is situated at the exact coordinates ${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}.`,
        resortfullDescription: `${item.name} is a popular resort and swimming destination located in ${item.short_description}. It provides a relaxing environment for visitors, families, and groups to enjoy swimming, recreation, and leisure activities. With its recreational facilities and welcoming atmosphere, it offers an ideal place for relaxation and outdoor fun. The resort is located at the exact coordinates ${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}.`,
        sportsfullDescription: `${item.name} is a sports and recreation facility located in ${item.short_description}. It provides a space for residents and visitors to participate in sports, physical activities, training, and community events. The facility contributes to promoting an active lifestyle and serves as a venue for athletic activities and local gatherings. It is located at the exact coordinates ${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}.`,
        mallsfullDescription: `${item.name} is a commercial and shopping establishment located in ${item.short_description}. It serves as a convenient destination for shopping, dining, services, and other commercial activities, providing residents and visitors with access to a variety of businesses and establishments. As part of the local commercial area, it contributes to the economic activity and convenience of the community. The establishment is located at the exact coordinates ${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}.`,
        highlights: [
          `Verified coordinates (${item.lat.toFixed(4)}, ${item.lng.toFixed(4)})`,
          `Located in ${item.short_description}`,
          `Operating Hours: ${item.opening || '8:00 AM'} - ${item.closing || '5:00 PM'}`,
          `Attraction Type: ${mappedCategory}`
        ],
        howToGetThere: `Accessible via local transport in ${item.short_description}. Head toward GPS location ${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}.`,
        bestTimeToVisit: item.opening ? `During operational hours (${item.opening} - ${item.closing})` : 'Daytime visits recommended.',
        accessNotes: `Open to visitors. Operating hours: ${item.opening || '8:00 AM'} to ${item.closing || '5:00 PM'}.`,
        image,
        photoUrls: photoList.length > 0 ? photoList : [image],
        coordinates: { lat: item.lat, lng: item.lng },
        opening: item.opening || '8:00 AM',
        closing: item.closing || '5:00 PM'
      }
    })

  const categories = [
    'All',
    'Sports & Recreation Facilities',
    'Churches & Religious Landmarks',
    'Malls/Business establishments',
    'Day-Tour Resorts / Swimming Spots'
  ]

  const filteredDestinations = computed(() => {
    return destinationsData.filter(item => {
      const matchesCategory = selectedCategory.value === 'All'
        || item.category === selectedCategory.value
        || item.secondaryCategory === selectedCategory.value

      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch = !query
        || item.name.toLowerCase().includes(query)
        || item.barangay.toLowerCase().includes(query)
        || item.shortDescription.toLowerCase().includes(query)
        || item.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  })

  // Computed Origin & Destination objects for Route
  const routeOriginLandmark = computed(() => {
    if (!routeOriginId.value) return null
    return allLandmarkOptions.find(l => l.id === routeOriginId.value) || null
  })

  const routeDestinationLandmark = computed(() => {
    if (!routeDestinationId.value) return null
    return allLandmarkOptions.find(l => l.id === routeDestinationId.value) || null
  })

  const setRouteOrigin = (landmarkOrId: LandmarkOption | string | null) => {
    if (!landmarkOrId) routeOriginId.value = null
    else if (typeof landmarkOrId === 'string') routeOriginId.value = landmarkOrId
    else routeOriginId.value = landmarkOrId.name
  }

  const setRouteDestination = (landmarkOrId: LandmarkOption | string | null) => {
    if (!landmarkOrId) routeDestinationId.value = null
    else if (typeof landmarkOrId === 'string') routeDestinationId.value = landmarkOrId
    else routeDestinationId.value = landmarkOrId.name
  }

  const swapRoutePoints = () => {
    const temp = routeOriginId.value
    routeOriginId.value = routeDestinationId.value
    routeDestinationId.value = temp
  }

  const clearRoute = () => {
    routeOriginId.value = null
    routeDestinationId.value = null
  }

  // Pagination computed properties
  const totalPages = computed(() => Math.ceil(filteredDestinations.value.length / pageSize.value) || 1)

  const paginatedDestinations = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredDestinations.value.slice(start, start + pageSize.value)
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const searchSuggestions = computed(() => {
    const tagsSet = new Set<string>()
    destinationsData.forEach(d => {
      tagsSet.add(d.name)
      tagsSet.add(`Brgy. ${d.barangay}`)
      tagsSet.add(d.category)
      d.highlights.forEach(h => {
        if (h.length < 30) tagsSet.add(h)
      })
    })
    return Array.from(tagsSet)
  })

  // Google Maps markers array format for Map Explorer
  const mapMarkers = computed(() => {
    return filteredDestinations.value
      .filter(item => item.coordinates?.lat && item.coordinates?.lng)
      .map(item => {
        const lat = item.coordinates!.lat
        const lng = item.coordinates!.lng

        return {
          position: { lat, lng },
          title: `${item.name} (${item.barangay})`,
          infoWindowContent: `
            <div style="padding: 6px; max-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #85181a; margin-bottom: 2px;">${item.category}</div>
              <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 3px 0; line-height: 1.3;">${item.name}</h4>
              <p style="font-size: 11px; color: #666; margin: 0 0 8px 0;">Brgy. ${item.barangay}</p>
              <div style="display: flex; gap: 6px; align-items: center;">
                <button type="button" onclick="if(window.closeGoogleMapInfoWindow)window.closeGoogleMapInfoWindow()" style="display: inline-flex; align-items: center; justify-content: center; padding: 5px 10px; font-size: 11px; font-weight: 600; color: #ffffff; background-color: #85181a; border: none; border-radius: 6px; cursor: pointer;">
                  Close
                </button>
                <a href="/destinations/${item.id}" style="display: inline-flex; align-items: center; justify-content: center; padding: 5px 10px; font-size: 11px; font-weight: 600; color: #171717; background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; text-decoration: none;">
                  Details
                </a>
              </div>
            </div>
          `,
          onClick: () => {
            selectDestination(item)
          }
        }
      })
  })

  const selectedDestination = computed(() => {
    if (!activeDestinationId.value) return null
    return destinationsData.find(d => d.id === activeDestinationId.value) || null
  })

  const selectDestination = (destinationOrId: Destination | string | null) => {
    if (!destinationOrId) {
      activeDestinationId.value = null
    } else if (typeof destinationOrId === 'string') {
      activeDestinationId.value = destinationOrId
    } else {
      activeDestinationId.value = destinationOrId.id
    }
  }

  const getDestinationById = (idOrName?: string | null): Destination | undefined => {
    if (!idOrName) return undefined
    const normalized = decodeURIComponent(idOrName).toLowerCase().trim()
    const found = destinationsData.find(d => 
      d.id === idOrName || 
      d.name.toLowerCase().trim() === normalized ||
      d.name.toLowerCase().replace(/\s+/g, '-').trim() === normalized
    )
    if (found) return found

    // Fallback search in rawCoordinates for any landmark in San Francisco, Agusan del Sur
    const raw = (rawCoordinates as CoordinateItem[]).find(item =>
      item.id === idOrName ||
      item.name.toLowerCase().trim() === normalized ||
      item.name.toLowerCase().replace(/\s+/g, '-').trim() === normalized
    )
    if (raw) {
      const brgyMatch = raw.short_description.match(/(?:Barangay|Brgy\.?|Purok)\s+([A-Za-z0-9\s]+?)(?:,|$)/i)
      const barangay = brgyMatch ? brgyMatch[1]!.trim() : 'San Francisco'
      const photoList = raw.photoUrls && raw.photoUrls.length > 0 ? raw.photoUrls : []
      const image = photoList[0] || ''
      return {
        id: raw.id,
        name: raw.name,
        category: raw.category,
        secondaryCategory: raw.category,
        barangay,
        shortDescription: raw.short_description,
        churchfullDescription: raw.short_description,
        resortfullDescription: raw.short_description,
        sportsfullDescription: raw.short_description,
        mallsfullDescription: raw.short_description,
        highlights: [
          `Verified coordinates (${raw.lat.toFixed(4)}, ${raw.lng.toFixed(4)})`,
          `Located in ${raw.short_description}`,
          `Operating Hours: ${raw.opening || '8:00 AM'} - ${raw.closing || '5:00 PM'}`,
        ],
        howToGetThere: `Accessible via local transport in ${raw.short_description}. Head toward GPS location ${raw.lat.toFixed(4)}, ${raw.lng.toFixed(4)}.`,
        bestTimeToVisit: raw.opening ? `During operational hours (${raw.opening} - ${raw.closing})` : 'Daytime visits recommended.',
        accessNotes: `Open to visitors. Operating hours: ${raw.opening || '8:00 AM'} to ${raw.closing || '5:00 PM'}.`,
        image,
        photoUrls: photoList.length > 0 ? photoList : [image],
        coordinates: { lat: raw.lat, lng: raw.lng },
        opening: raw.opening || '8:00 AM',
        closing: raw.closing || '5:00 PM'
      }
    }
    return undefined
  }


  const selectCategory = (cat: string) => {
    selectedCategory.value = cat
  }

  const toggleViewMode = (mode?: 'grid' | 'map') => {
    if (mode) {
      viewMode.value = mode
    } else {
      viewMode.value = viewMode.value === 'grid' ? 'map' : 'grid'
    }
  }

  return {
    destinationsData,
    allLandmarkOptions,
    categories,
    searchQuery,
    selectedCategory,
    activeDestinationId,
    selectedDestination,
    filteredDestinations,
    paginatedDestinations,
    currentPage,
    pageSize,
    totalPages,
    searchSuggestions,
    mapMarkers,
    viewMode,
    routeOriginId,
    routeDestinationId,
    routeTravelMode,
    routeOriginLandmark,
    routeDestinationLandmark,
    setRouteOrigin,
    setRouteDestination,
    swapRoutePoints,
    clearRoute,
    fetchCoordinatesData,
    selectDestination,
    getDestinationById,
    selectCategory,
    toggleViewMode,
    goToPage
  }
}
