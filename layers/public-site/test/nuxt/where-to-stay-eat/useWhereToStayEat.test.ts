import { describe, it, expect } from 'vitest'
import { useWhereToStayEat } from '../../../app/composables/useWhereToStayEat'

describe('useWhereToStayEat composable', () => {
  it('provides stay and eat establishments loaded and classified from coordinates.json', () => {
    const { establishmentsData, mainCategories, staySubCategories, eatSubCategories } = useWhereToStayEat()

    expect(establishmentsData.length).toBeGreaterThan(0)
    expect(mainCategories).toContain('Where to Stay')
    expect(mainCategories).toContain('Where to Eat')
    expect(staySubCategories).toEqual(['Hotels', 'Inns / lodges', 'Homestays', 'Resorts'])
    expect(eatSubCategories).toEqual(['Restaurants', 'Eateries / carinderias', 'Cafes', 'Local food stalls'])

    const sample = establishmentsData[0]!
    expect(sample).toHaveProperty('id')
    expect(sample).toHaveProperty('name')
    expect(sample).toHaveProperty('mainCategory')
    expect(sample).toHaveProperty('subCategory')
    expect(sample).toHaveProperty('category')
    expect(sample).toHaveProperty('address')
    expect(sample).toHaveProperty('coordinates')
    expect(['Where to Stay', 'Where to Eat']).toContain(sample.mainCategory)
  })

  it('defaults selectedCategory to "All" and viewMode to "grid"', () => {
    const { selectedCategory, selectedMainCategory, selectedSubCategory, selectedBarangay, viewMode, currentPage } = useWhereToStayEat()

    expect(selectedMainCategory.value).toBe('All')
    expect(selectedSubCategory.value).toBe('All')
    expect(selectedCategory.value).toBe('All')
    expect(selectedBarangay.value).toBe('All')
    expect(viewMode.value).toBe('grid')
    expect(currentPage.value).toBe(1)
  })

  it('filters establishments by mainCategory and subCategory', () => {
    const { selectMainCategory, selectSubCategory, selectedMainCategory, selectedSubCategory, filteredEstablishments } = useWhereToStayEat()

    selectMainCategory('Where to Stay')
    expect(selectedMainCategory.value).toBe('Where to Stay')
    filteredEstablishments.value.forEach(item => {
      expect(item.mainCategory).toBe('Where to Stay')
    })

    selectSubCategory('Homestays')
    expect(selectedSubCategory.value).toBe('Homestays')
    filteredEstablishments.value.forEach(item => {
      expect(item.subCategory).toBe('Homestays')
    })
  })

  it('filters establishments by search query', () => {
    const { searchQuery, filteredEstablishments, establishmentsData } = useWhereToStayEat()

    const targetItem = establishmentsData[0]!
    searchQuery.value = targetItem.name.slice(0, 4)

    expect(filteredEstablishments.value.length).toBeGreaterThan(0)
    const names = filteredEstablishments.value.map(e => e.name.toLowerCase())
    expect(names.some(name => name.includes(targetItem.name.slice(0, 4).toLowerCase()))).toBe(true)
  })

  it('resets currentPage to 1 when filters or search query change', () => {
    const { currentPage, searchQuery, selectMainCategory } = useWhereToStayEat()

    currentPage.value = 3
    expect(currentPage.value).toBe(3)

    searchQuery.value = 'Cafe'
    expect(currentPage.value).toBe(1)

    currentPage.value = 2
    selectMainCategory('Where to Stay')
    expect(currentPage.value).toBe(1)
  })

  it('selects an establishment and updates selectedEstablishment computed property', () => {
    const { selectEstablishment, selectedEstablishment, establishmentsData } = useWhereToStayEat()

    const target = establishmentsData[0]!
    selectEstablishment(target)
    expect(selectedEstablishment.value?.id).toBe(target.id)

    selectEstablishment(null)
    expect(selectedEstablishment.value).toBeNull()
  })

  it('computes allEstablishmentMarkers and keeps mapMarkers focused on user location and selected destination', () => {
    const { mapMarkers, allEstablishmentMarkers, filteredEstablishments, selectEstablishment, setUserLocation, userLocation, establishmentsData } = useWhereToStayEat()

    expect(allEstablishmentMarkers.value.length).toBe(filteredEstablishments.value.length)

    // Initially when no user location and no selection
    expect(mapMarkers.value.length).toBe(0)

    // When establishment is selected, only that destination is in mapMarkers
    const target = establishmentsData[0]!
    selectEstablishment(target)
    expect(mapMarkers.value.length).toBe(1)
    expect(mapMarkers.value[0]?.title).toContain(target.name)
    expect(mapMarkers.value[0]?.title).toContain(target.address)
    expect(mapMarkers.value[0]?.infoWindowContent).toContain(target.name)

    // When user location is added, mapMarkers contains user location and destination
    setUserLocation({ lat: 8.5042, lng: 125.9786 }, 10)
    expect(userLocation.value).toEqual({ lat: 8.5042, lng: 125.9786 })
    expect(mapMarkers.value.length).toBe(2)
    expect(mapMarkers.value[0]?.title).toContain('Starting Point')
    expect(mapMarkers.value[0]?.isUserLocation).toBe(true)
    expect(mapMarkers.value[0]?.infoWindowContent).toContain('Device GPS Location')
  })

  it('calculates distance to user accurately', () => {
    const { setUserLocation, calculateDistanceToUser } = useWhereToStayEat()

    // When no user location is set
    expect(calculateDistanceToUser({ lat: 8.5050, lng: 125.9790 })).toBeNull()

    // Set user location
    setUserLocation({ lat: 8.5042, lng: 125.9786 })
    const dist = calculateDistanceToUser({ lat: 8.5142, lng: 125.9786 })
    expect(dist).not.toBeNull()
    expect(dist?.distanceKm).toBeGreaterThan(0)
    expect(dist?.distanceText).toMatch(/(m|km)/)
  })

  it('updates routeOrigin and routeDestination when userLocation and selectedEstablishment change', () => {
    const { setUserLocation, selectEstablishment, routeOrigin, routeDestination, establishmentsData } = useWhereToStayEat()

    expect(routeOrigin.value).toBeNull()
    expect(routeDestination.value).toBeNull()

    const target = establishmentsData[0]!
    selectEstablishment(target)
    expect(routeDestination.value).toEqual(target.coordinates)

    setUserLocation({ lat: 8.5042, lng: 125.9786 })
    expect(routeOrigin.value).toEqual({ lat: 8.5042, lng: 125.9786 })
  })

  it('handles requestUserLocation with browser geolocation API', async () => {
    const { requestUserLocation, userLocation, locationAccuracy } = useWhereToStayEat()

    const mockGeo = {
      getCurrentPosition: (success: (pos: any) => void) => {
        success({
          coords: {
            latitude: 8.5042,
            longitude: 125.9786,
            accuracy: 15
          }
        })
      },
      watchPosition: () => 123,
      clearWatch: () => {}
    }

    const originalGeo = Object.getOwnPropertyDescriptor(globalThis.navigator, 'geolocation')
    try {
      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: mockGeo,
        configurable: true,
        writable: true
      })

      const res = await requestUserLocation()
      expect(res).toEqual({ lat: 8.5042, lng: 125.9786 })
      expect(userLocation.value).toEqual({ lat: 8.5042, lng: 125.9786 })
      expect(locationAccuracy.value).toBe(15)
    } finally {
      if (originalGeo) {
        Object.defineProperty(globalThis.navigator, 'geolocation', originalGeo)
      }
    }
  })
})
