import { describe, it, expect } from 'vitest'
import { useEmergency, classifyMedicalFacility, calculateDistanceKm, calculateBearing } from '../../../app/composables/useEmergency'

describe('useEmergency composable', () => {
  it('classifies medical facilities into Hospitals, Clinics, and Pharmacies', () => {
    expect(classifyMedicalFacility('HOSPITAL', 'San Francisco Doctors Hospital')?.mainCategory).toBe('Hospitals')
    expect(classifyMedicalFacility('CLINIC', 'Rural Health Unit (RHU)')?.mainCategory).toBe('Clinics')
    expect(classifyMedicalFacility('CLINIC', 'Dr. Paul Dental Clinic')?.subCategory).toBe('Dental Clinics')
    expect(classifyMedicalFacility('AESTHETIC_CLINICS', 'Euphoria House of Beauty')?.mainCategory).toBe('Clinics')
    expect(classifyMedicalFacility('PHARMACY_DRUG_STORE', 'Mercury Drug')?.mainCategory).toBe('Pharmacies')
  })

  it('calculates bearing angle between two coordinates correctly', () => {
    // Due North
    const northBearing = calculateBearing({ lat: 8.5000, lng: 125.9000 }, { lat: 8.5100, lng: 125.9000 })
    expect(Math.round(northBearing)).toBe(0)

    // Due East
    const eastBearing = calculateBearing({ lat: 8.5000, lng: 125.9000 }, { lat: 8.5000, lng: 125.9100 })
    expect(Math.round(eastBearing)).toBe(90)

    // Due South
    const southBearing = calculateBearing({ lat: 8.5100, lng: 125.9000 }, { lat: 8.5000, lng: 125.9000 })
    expect(Math.round(southBearing)).toBe(180)

    // Due West
    const westBearing = calculateBearing({ lat: 8.5000, lng: 125.9100 }, { lat: 8.5000, lng: 125.9000 })
    expect(Math.round(westBearing)).toBe(270)
  })

  it('loads medical facilities from coordinates.json and sets default state', () => {
    const { facilitiesData, categories, emergencyHotlines, selectedCategory, viewMode, currentPage } = useEmergency()

    expect(facilitiesData.length).toBeGreaterThan(0)
    expect(categories.value).toEqual(['All', 'Hospitals', 'Clinics', 'Pharmacies'])
    expect(emergencyHotlines.length).toBeGreaterThan(0)
    expect(selectedCategory.value).toBe('All')
    expect(viewMode.value).toBe('grid')
    expect(currentPage.value).toBe(1)

    const first = facilitiesData[0]!
    expect(first).toHaveProperty('id')
    expect(first).toHaveProperty('name')
    expect(first).toHaveProperty('mainCategory')
    expect(first).toHaveProperty('address')
    expect(first).toHaveProperty('coordinates')
    expect(['Hospitals', 'Clinics', 'Pharmacies']).toContain(first.mainCategory)
  })

  it('filters facilities by category and subcategory', () => {
    const { selectCategory, selectSubCategory, selectedCategory, selectedSubCategory, filteredFacilities } = useEmergency()

    selectCategory('Hospitals')
    expect(selectedCategory.value).toBe('Hospitals')
    filteredFacilities.value.forEach(item => {
      expect(item.mainCategory).toBe('Hospitals')
    })

    selectCategory('Pharmacies')
    expect(selectedCategory.value).toBe('Pharmacies')
    filteredFacilities.value.forEach(item => {
      expect(item.mainCategory).toBe('Pharmacies')
    })
  })

  it('filters facilities by search query', () => {
    const { searchQuery, filteredFacilities, facilitiesData } = useEmergency()

    const target = facilitiesData[0]!
    searchQuery.value = target.name.slice(0, 4)

    expect(filteredFacilities.value.length).toBeGreaterThan(0)
    const matches = filteredFacilities.value.some(f => f.name.toLowerCase().includes(target.name.slice(0, 4).toLowerCase()))
    expect(matches).toBe(true)
  })

  it('selects a medical facility and sets selectedFacility', () => {
    const { selectFacility, selectedFacility, facilitiesData } = useEmergency()

    const target = facilitiesData[0]!
    selectFacility(target)
    expect(selectedFacility.value?.id).toBe(target.id)

    selectFacility(null)
    expect(selectedFacility.value).toBeNull()
  })

  it('calculates distance to user correctly', () => {
    const { setUserLocation, calculateDistanceToUser } = useEmergency()

    expect(calculateDistanceToUser({ lat: 8.5042, lng: 125.9786 })).toBeNull()

    setUserLocation({ lat: 8.5042, lng: 125.9786 })
    const dist = calculateDistanceToUser({ lat: 8.5142, lng: 125.9786 })
    expect(dist).not.toBeNull()
    expect(dist?.distanceKm).toBeGreaterThan(0)
    expect(dist?.distanceText).toMatch(/(m|km)/)
  })

  it('tracks user movement and calculates direction heading automatically', () => {
    const { setUserLocation, userLocation, userHeading } = useEmergency()

    // Initial position
    setUserLocation({ lat: 8.5000, lng: 125.9000 })
    expect(userLocation.value).toEqual({ lat: 8.5000, lng: 125.9000 })
    expect(userHeading.value).toBeNull()

    // User moves East
    setUserLocation({ lat: 8.5000, lng: 125.9100 })
    expect(userLocation.value).toEqual({ lat: 8.5000, lng: 125.9100 })
    expect(userHeading.value).toBe(90)

    // User moves North with explicit heading passed
    setUserLocation({ lat: 8.5100, lng: 125.9100 }, 10, 45, 5)
    expect(userHeading.value).toBe(45)
  })

  it('computes mapMarkers with device GPS location, heading, and destination facility info window', () => {
    const { mapMarkers, selectFacility, setUserLocation, userLocation, userHeading, facilitiesData } = useEmergency()

    expect(mapMarkers.value.length).toBe(0)

    const target = facilitiesData[0]!
    selectFacility(target)
    expect(mapMarkers.value.length).toBe(1)
    expect(mapMarkers.value[0]?.title).toContain(target.name)
    expect(mapMarkers.value[0]?.title).toContain(target.address)
    expect(mapMarkers.value[0]?.infoWindowContent).toContain(target.name)

    setUserLocation({ lat: 8.5042, lng: 125.9786 }, 5, 120)
    expect(userLocation.value).toEqual({ lat: 8.5042, lng: 125.9786 })
    expect(userHeading.value).toBe(120)
    expect(mapMarkers.value.length).toBe(2)
    expect(mapMarkers.value[0]?.title).toContain('Starting Point')
    expect(mapMarkers.value[0]?.isUserLocation).toBe(true)
    expect(mapMarkers.value[0]?.heading).toBe(120)
    expect(mapMarkers.value[0]?.infoWindowContent).toContain('Device Location')
    expect(mapMarkers.value[0]?.infoWindowContent).toContain('Satellite GPS')
    expect(mapMarkers.value[0]?.infoWindowContent).toContain('Direction: 120°')
    expect(mapMarkers.value[0]?.infoWindowContent).toContain('Close')
  })

  it('determines locationSource type and accuracy correctly based on meters accuracy', () => {
    const { setUserLocation, locationSource } = useEmergency()

    expect(locationSource.value).toBeNull()

    // Satellite GPS (<= 20m)
    setUserLocation({ lat: 8.5042, lng: 125.9786 }, 8)
    expect(locationSource.value?.type).toBe('satellite')
    expect(locationSource.value?.isHighPrecision).toBe(true)
    expect(locationSource.value?.accuracyRadiusText).toBe('±8m')

    // Wi-Fi Positioning (21m - 150m)
    setUserLocation({ lat: 8.5042, lng: 125.9786 }, 65)
    expect(locationSource.value?.type).toBe('wifi')
    expect(locationSource.value?.isHighPrecision).toBe(false)
    expect(locationSource.value?.accuracyRadiusText).toBe('±65m')

    // ISP Network IP (> 150m)
    setUserLocation({ lat: 8.5042, lng: 125.9786 }, 2500)
    expect(locationSource.value?.type).toBe('network')
    expect(locationSource.value?.isHighPrecision).toBe(false)
    expect(locationSource.value?.accuracyRadiusText).toBe('±2.5km')
  })
})
