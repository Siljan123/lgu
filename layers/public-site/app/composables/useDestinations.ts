import { ref, computed, watch } from 'vue'
import rawCoordinates from '../../coordinates.json'

export interface Destination {
  id: string
  name: string
  category: string
  secondaryCategory?: string
  barangay: string
  shortDescription: string
  fullDescription: string
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

export const useDestinations = () => {
  const searchQuery = ref('')
  const selectedCategory = ref<string>('All')
  const activeDestinationId = ref<string | null>(null)
  const viewMode = ref<'grid' | 'map'>('grid')
  const currentPage = ref(1)
  const pageSize = ref(6)

  // Watch search and category to reset pagination to page 1
  watch([searchQuery, selectedCategory], () => {
    currentPage.value = 1
  })

  // Map raw entries 
  const destinationCategories = [
    'INDLAND_RESORTS',
    'Church',
    'PALARONG_PAMBANSA',
    'MABUHAY_ACCOMMODATIONS',
    'HOMESTAYS',
    'MALLS'
  ]

  const destinationsData: Destination[] = (rawCoordinates as CoordinateItem[])
    .filter(item => destinationCategories.includes(item.category))
    .map(item => {
      let mappedCategory = 'Civic Landmarks'
      if (item.category === 'INDLAND_RESORTS') mappedCategory = 'Inland Resorts'
      else if (item.category === 'Church') mappedCategory = 'Heritage & Culture'
      else if (item.category === 'PALARONG_PAMBANSA') mappedCategory = 'Parks & Viewpoints'
      else if (item.category === 'MABUHAY_ACCOMMODATIONS' || item.category === 'HOMESTAYS') mappedCategory = 'Resorts & Staycations'
      else if (item.category === 'MALLS') mappedCategory = 'Civic Landmarks'

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
        fullDescription: `${item.name} is an official landmark and visitor attraction in San Francisco, Agusan del Sur, located at ${item.short_description}. Sourced directly from the LGU dataset with exact coordinates at ${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}.`,
        highlights: [
          `Verified coordinates (${item.lat.toFixed(4)}, ${item.lng.toFixed(4)})`,
          `Located in ${item.short_description}`,
          `Hours: ${item.opening || '8:00 AM'} - ${item.closing || '5:00 PM'}`,
          `Category: ${mappedCategory}`
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
    'Inland Resorts',
    'Heritage & Culture',
    'Parks & Viewpoints',
    'Resorts & Staycations',
    'Civic Landmarks'
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
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

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

  const getDestinationById = (id: string): Destination | undefined => {
    return destinationsData.find(d => d.id === id)
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
    selectDestination,
    getDestinationById,
    selectCategory,
    toggleViewMode,
    goToPage
  }
}


