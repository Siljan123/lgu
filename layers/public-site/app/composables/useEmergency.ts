import { ref, computed, watch } from 'vue'
import rawCoordinatesData from '../../coordinates.json'

export type EmergencyCategory = 'Hospitals' | 'Clinics' | 'Pharmacies'

export interface MedicalFacility {
  id: string
  name: string
  mainCategory: EmergencyCategory
  subCategory: string
  category: string
  address: string
  contactNo?: string
  barangay: string
  operatingHours?: string
  description?: string
  coordinates: { lat: number; lng: number }
  image?: string
  photoUrls?: string[]
  is24Hours?: boolean
}

export interface EmergencyContact {
  id: string
  agency: string
  phone?: string
  mobile?: string
  category: 'Rescue & Disaster' | 'Police & Security' | 'Fire Protection' | 'Hospital & Medical' | 'Health Office'
  badgeColor: string
}

export type LocationSourceType = 'satellite' | 'wifi' | 'network'

export interface LocationSourceInfo {
  type: LocationSourceType
  label: string
  shortLabel: string
  description: string
  accuracyMeters: number
  accuracyRadiusText: string
  isHighPrecision: boolean
  color: string
}

export const EMERGENCY_HOTLINES: EmergencyContact[] = [
  {
    id: 'hotline-mdrrmo',
    agency: 'MDRRMO SFADS Rescue 24/7',
    phone: '(085) 839-2111',
    mobile: '0919-456-7890',
    category: 'Rescue & Disaster',
    badgeColor: '#dc2626'
  },
  {
    id: 'hotline-hospital-er',
    agency: 'San Francisco Doctors Hospital — Emergency Room',
    phone: '(085) 839-5566',
    mobile: '0920-112-3344',
    category: 'Hospital & Medical',
    badgeColor: '#e11d48'
  },
  {
    id: 'hotline-rhu',
    agency: 'San Francisco Rural Health Unit (RHU)',
    phone: '(085) 343-8123',
    mobile: '0948-234-5678',
    category: 'Health Office',
    badgeColor: '#16a34a'
  },
  {
    id: 'hotline-pnp',
    agency: 'PNP San Francisco Municipal Police Station',
    phone: '(085) 343-9876',
    mobile: '0998-598-7654',
    category: 'Police & Security',
    badgeColor: '#2563eb'
  },
  {
    id: 'hotline-bfp',
    agency: 'Bureau of Fire Protection (BFP) San Francisco',
    phone: '(085) 839-2222',
    mobile: '0912-345-6789',
    category: 'Fire Protection',
    badgeColor: '#ea580c'
  }
]

export const EMERGENCY_CATEGORIES: EmergencyCategory[] = ['Hospitals', 'Clinics', 'Pharmacies']

export function classifyMedicalFacility(rawCat: string, name: string = ''): { mainCategory: EmergencyCategory; subCategory: string } | null {
  const cat = (rawCat || '').trim().toUpperCase()
  const lowerName = (name || '').toLowerCase()

  if (cat === 'HOSPITAL') {
    return { mainCategory: 'Hospitals', subCategory: 'General Hospitals' }
  }
  if (cat === 'CLINIC') {
    if (lowerName.includes('dental')) {
      return { mainCategory: 'Clinics', subCategory: 'Dental Clinics' }
    }
    if (lowerName.includes('laboratory') || lowerName.includes('diagnostic')) {
      return { mainCategory: 'Clinics', subCategory: 'Diagnostic Laboratories' }
    }
    if (lowerName.includes('animal bite')) {
      return { mainCategory: 'Clinics', subCategory: 'Animal Bite & Special Care' }
    }
    if (lowerName.includes('rural health') || lowerName.includes('rhu')) {
      return { mainCategory: 'Clinics', subCategory: 'Rural Health Units (RHU)' }
    }
    return { mainCategory: 'Clinics', subCategory: 'Multispecialty & Polyclinics' }
  }

  if (cat === 'AESTHETIC_CLINICS') {
    return { mainCategory: 'Clinics', subCategory: 'Aesthetic & Wellness Clinics' }
  }

  if (cat === 'PHARMACY_DRUG_STORE') {
    return { mainCategory: 'Pharmacies', subCategory: 'Pharmacies & Drug Stores' }
  }

  // Fallbacks by keywords
  if (lowerName.includes('hospital')) {
    return { mainCategory: 'Hospitals', subCategory: 'General Hospitals' }
  }
  if (lowerName.includes('pharmacy') || lowerName.includes('drug')) {
    return { mainCategory: 'Pharmacies', subCategory: 'Pharmacies & Drug Stores' }
  }
  if (lowerName.includes('clinic') || lowerName.includes('health unit') || lowerName.includes('laboratory')) {
    return { mainCategory: 'Clinics', subCategory: 'Multispecialty & Polyclinics' }
  }

  return null
}

function extractPhone(address: string): string | undefined {
  if (!address) return undefined
  const match = address.match(/(09\d{9}|\(085\)\s*\d{3}-\d{4}|\d{4}-\d{3}-\d{4})/i)
  return match ? match[0] : undefined
}

export function calculateDistanceKm(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
): { distanceMeters: number; distanceKm: number; distanceText: string } {
  const R = 6371e3 // Earth radius in metres
  const φ1 = (p1.lat * Math.PI) / 180
  const φ2 = (p2.lat * Math.PI) / 180
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const meters = Math.round(R * c)
  const km = Number((meters / 1000).toFixed(1))

  return {
    distanceMeters: meters,
    distanceKm: km,
    distanceText: meters < 1000 ? `${meters} m` : `${km} km`
  }
}

export function calculateBearing(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
): number {
  const startLat = (p1.lat * Math.PI) / 180
  const startLng = (p1.lng * Math.PI) / 180
  const destLat = (p2.lat * Math.PI) / 180
  const destLng = (p2.lng * Math.PI) / 180

  const y = Math.sin(destLng - startLng) * Math.cos(destLat)
  const x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng)
  const brng = (Math.atan2(y, x) * 180) / Math.PI
  return (brng + 360) % 360
}

export const useEmergency = () => {
  const searchQuery = ref('')
  const selectedCategory = ref<string>('All')
  const selectedSubCategory = ref<string>('All')
  const selectedBarangay = ref<string>('All')
  const viewMode = ref<'grid' | 'table'>('grid')
  const activeFacilityId = ref<string | null>(null)

  const currentPage = ref(1)
  const itemsPerPage = ref(6)

  // Geolocation & Route State
  const userLocation = ref<{ lat: number; lng: number } | null>(null)
  const locationAccuracy = ref<number | null>(null)
  const userHeading = ref<number | null>(null)
  const userSpeed = ref<number | null>(null)
  const isLocating = ref(false)
  const locationError = ref<string | null>(null)
  const isLiveTracking = ref(false)
  const routeCalculationResult = ref<any | null>(null)
  const watchId = ref<number | null>(null)
  let orientationHandler: ((e: any) => void) | null = null

  // GPS stabilization: tracks the timestamp of the last accepted position update
  // to debounce rapid interleaved fixes from different sources (IP/Wi-Fi/satellite).
  let lastPositionUpdateTime = 0
  const POSITION_UPDATE_COOLDOWN_MS = 2000

  // Parse and classify medical & emergency places from coordinates.json
  const facilitiesData: MedicalFacility[] = (rawCoordinatesData as any[]).reduce<MedicalFacility[]>((acc, item) => {
    const classification = classifyMedicalFacility(item.category || '', item.name || '')
    if (!classification) return acc

    const phone = extractPhone(item.short_description || '')
    const addressStr = item.short_description || 'San Francisco, Agusan del Sur'

    let hours: string | undefined = undefined
    if (item.opening && item.closing) {
      hours = `${item.opening} - ${item.closing}`
    }

    const is24h =
      (item.opening === '8:00 AM' && item.closing === '7:59 AM') ||
      classification.mainCategory === 'Hospitals' ||
      (item.name || '').toLowerCase().includes('24/7') ||
      (item.name || '').toLowerCase().includes('24 hours')

    acc.push({
      id: item.id || `medical-${item.lat}-${item.lng}`,
      name: item.name || 'Medical Facility',
      mainCategory: classification.mainCategory,
      subCategory: classification.subCategory,
      category: classification.subCategory,
      address: addressStr,
      contactNo: phone,
      barangay: addressStr,
      operatingHours: hours || (is24h ? '24 Hours Open' : '8:00 AM - 5:00 PM'),
      coordinates: { lat: Number(item.lat), lng: Number(item.lng) },
      image: item.photoUrls && item.photoUrls.length > 0 ? item.photoUrls[0] : undefined,
      photoUrls: item.photoUrls || [],
      is24Hours: Boolean(is24h)
    })
    return acc
  }, [])

  const categories = computed(() => ['All', ...EMERGENCY_CATEGORIES])

  const subCategories = computed(() => {
    const set = new Set<string>()
    facilitiesData.forEach(f => {
      if (selectedCategory.value === 'All' || f.mainCategory === selectedCategory.value) {
        set.add(f.subCategory)
      }
    })
    return ['All', ...Array.from(set).sort()]
  })
  // Category counts
  const categoryCounts = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = {
      All: facilitiesData.length,
      Hospitals: 0,
      Clinics: 0,
      Pharmacies: 0
    }
    facilitiesData.forEach(item => {
      const cat = item.mainCategory
      counts[cat] = (counts[cat] ?? 0) + 1
    })
    return counts
  })

  const filteredFacilities = computed(() => {
    return facilitiesData.filter(item => {
      const matchesMainCat =
        selectedCategory.value === 'All' ||
        item.mainCategory === selectedCategory.value

      const matchesSubCat =
        selectedSubCategory.value === 'All' ||
        item.subCategory === selectedSubCategory.value

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

  // Synchronously reset page on filter change
  watch([selectedCategory, selectedSubCategory, selectedBarangay, searchQuery], () => {
    currentPage.value = 1
  }, { flush: 'sync' })

  const paginatedFacilities = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredFacilities.value.slice(start, end)
  })

  const selectedFacility = computed(() => {
    if (!activeFacilityId.value) return null
    return facilitiesData.find(e => e.id === activeFacilityId.value) || null
  })


  const locationSource = computed<LocationSourceInfo | null>(() => {
    if (!userLocation.value || locationAccuracy.value === null) return null

    const acc = Math.round(locationAccuracy.value)
    const accText = acc < 1000 ? `±${acc}m` : `±${(acc / 1000).toFixed(1)}km`

    if (acc <= 20) {
      return {
        type: 'satellite',
        label: 'Satellite GPS',
        shortLabel: `Satellite GPS`,
        description: 'Locked onto orbital satellites (precise street-level accuracy)',
        accuracyMeters: acc,
        accuracyRadiusText: accText,
        isHighPrecision: true,
        color: '#059669',
      }
    }

    if (acc <= 150) {
      return {
        type: 'wifi',
        label: 'Wi-Fi Positioning',
        shortLabel: `Wi-Fi Network`,
        description: 'Estimated via nearby Wi-Fi network beacons (neighborhood-level accuracy)',
        accuracyMeters: acc,
        accuracyRadiusText: accText,
        isHighPrecision: false,
        color: '#2563eb',
      }
    }

    return {
      type: 'network',
      label: 'Network IP',
      shortLabel: `ISP / Network IP `,
      description: 'Estimated from ISP public IP address (approximate area on laptops without GPS chip)',
      accuracyMeters: acc,
      accuracyRadiusText: accText,
      isHighPrecision: false,
      color: '#d97706',
    }
  })

  const mapMarkers = computed(() => {
    const markers: Array<{
      address: string
      title: string
      position: { lat: number; lng: number }
      isUserLocation?: boolean
      heading?: number | null
      infoWindowContent?: string
    }> = []

    if (userLocation.value) {
      const headingVal = userHeading.value !== null
        ? userHeading.value
        : (selectedFacility.value?.coordinates
            ? Math.round(calculateBearing(userLocation.value, selectedFacility.value.coordinates))
            : 0)

      const headingDisplay = `${headingVal}°`
      const speedDisplay = userSpeed.value !== null && userSpeed.value > 0
        ? `${Math.round(userSpeed.value * 3.6)} km/h`
        : null

      markers.push({
        address: 'Your Device GPS Location',
        title: 'Starting Point (Your GPS Location)',
        position: userLocation.value,
        isUserLocation: true,
        heading: headingVal,
        infoWindowContent: `
          <div style="padding: 8px 12px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-size: 10px; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 2px;">Starting Point</div>
            <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 2px 0;">Your Device Location</h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">Lat: ${userLocation.value.lat.toFixed(5)}, Lng: ${userLocation.value.lng.toFixed(5)}</p>
            ${locationSource.value ? `
              <div style="display: inline-block; font-size: 10px; font-weight: 600; color: ${locationSource.value.color}; margin-bottom: 3px; background: rgba(0,0,0,0.04); padding: 2px 6px; border-radius: 4px;">
                ${locationSource.value.shortLabel}
              </div>
            ` : ''}
            <div style="font-size: 10px; color: #0284c7; font-weight: 600; margin-bottom: 8px;">
              Direction: ${headingDisplay}${speedDisplay ? ` • Speed: ${speedDisplay}` : ''}
            </div>
            <div style="display: flex; gap: 6px;">
              <button type="button" onclick="if(window.closeGoogleMapInfoWindow)window.closeGoogleMapInfoWindow()" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 8px; font-size: 10px; font-weight: 600; color: #ffffff; background-color: #10b981; border: none; border-radius: 4px; cursor: pointer;">
                Close
              </button>
            </div>
          </div>
        `
      })
    }

    if (selectedFacility.value?.coordinates) {
      const fac = selectedFacility.value
      markers.push({
        address: fac.address,
        title: `${fac.name} — ${fac.address}`,
        position: { lat: fac.coordinates.lat, lng: fac.coordinates.lng },
        isUserLocation: false,
        infoWindowContent: `
          <div style="padding: 4px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
            <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 3px 0; line-height: 1.3;">${fac.name}</h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">${fac.address}</p>
            <div style="margin-top: 8px; display: flex; gap: 6px;">
              <button type="button" onclick="if(window.closeGoogleMapInfoWindow)window.closeGoogleMapInfoWindow()" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 8px; font-size: 10px; font-weight: 600; color: #ffffff; background-color: #dc2626; border: none; border-radius: 4px; cursor: pointer;">
                Close
              </button>
            </div>
          </div>
        `
      })
    }

    return markers
  })

  const routeOrigin = computed(() => userLocation.value)
  const routeDestination = computed(() => selectedFacility.value?.coordinates || null)

  const selectCategory = (cat: string) => {
    selectedCategory.value = cat
    selectedSubCategory.value = 'All'
  }

  const selectSubCategory = (subCat: string) => {
    selectedSubCategory.value = subCat
  }

  const selectBarangay = (brgy: string) => {
    selectedBarangay.value = brgy
  }

  const selectFacility = (itemOrId: MedicalFacility | string | null) => {
    if (!itemOrId) {
      activeFacilityId.value = null
    } else if (typeof itemOrId === 'string') {
      activeFacilityId.value = itemOrId
    } else {
      activeFacilityId.value = itemOrId.id
    }
  }

  const setUserLocation = (
    coords: { lat: number; lng: number } | null,
    accuracy: number | null = null,
    heading: number | null = null,
    speed: number | null = null
  ) => {
    if (coords && userLocation.value && heading === null) {
      const dist = calculateDistanceKm(userLocation.value, coords)
      if (dist.distanceMeters >= 2) {
        userHeading.value = Math.round(calculateBearing(userLocation.value, coords))
      }
    } else if (heading !== null) {
      userHeading.value = heading
    }

    userLocation.value = coords
    locationAccuracy.value = accuracy
    if (speed !== null) {
      userSpeed.value = speed
    }
    if (coords) {
      locationError.value = null
    }
  }

  const calculateDistanceToUser = (targetCoords: { lat: number; lng: number }) => {
    if (!userLocation.value) return null
    return calculateDistanceKm(userLocation.value, targetCoords)
  }

  const startOrientationListening = () => {
  if (typeof window === 'undefined') return
  if (orientationHandler) return
  orientationHandler = (e: any) => {
    if (e.webkitCompassHeading != null && !isNaN(e.webkitCompassHeading)) {
      userHeading.value = Math.round(e.webkitCompassHeading)
    } else if (e.absolute && e.alpha != null && !isNaN(e.alpha)) {
      const heading = (360 - e.alpha) % 360
      userHeading.value = Math.round(heading)
    }
  }
  if (typeof (window as any).ondeviceorientationabsolute !== 'undefined') {
    window.addEventListener('deviceorientationabsolute' as any, orientationHandler as any, { passive: true })
  } else if (typeof (window as any).ondeviceorientation !== 'undefined' || typeof window.DeviceOrientationEvent !== 'undefined') {
    window.addEventListener('deviceorientation' as any, orientationHandler as any, { passive: true })
  }
}

  const stopTracking = () => {
    if (typeof window !== 'undefined') {
      if (watchId.value !== null && navigator?.geolocation) {
        navigator.geolocation.clearWatch(watchId.value)
        watchId.value = null
      }
      if (orientationHandler) {
        window.removeEventListener('deviceorientationabsolute', orientationHandler)
        window.removeEventListener('deviceorientation', orientationHandler)
        orientationHandler = null
      }
    }
    isLiveTracking.value = false
  }

  const requestUserLocation = (options?: { enableHighAccuracy?: boolean; watch?: boolean }): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is undefined'))
        return
      }

      if (!navigator?.geolocation) {
        const errStr = 'Geolocation is not supported by your browser or environment.'
        locationError.value = errStr
        isLocating.value = false
        reject(new Error(errStr))
        return
      }

      isLocating.value = true
      locationError.value = null

      const successHandler = (position: GeolocationPosition) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        const accuracy = position.coords.accuracy
        const now = Date.now()
        const isFirstFix = userLocation.value === null

        // GPS stabilization: reject severely degraded accuracy and debounce rapid updates
        if (!isFirstFix && locationAccuracy.value !== null) {
          const accuracyDegradationLimit = locationAccuracy.value * 3
          if (accuracy > accuracyDegradationLimit && accuracy > 100) {
            isLocating.value = false
            resolve(coords)
            return
          }
          const elapsed = now - lastPositionUpdateTime
          const isMoreAccurate = accuracy < locationAccuracy.value
          if (elapsed < POSITION_UPDATE_COOLDOWN_MS && !isMoreAccurate) {
            isLocating.value = false
            resolve(coords)
            return
          }
        }

        const speed = position.coords.speed !== null && !isNaN(position.coords.speed) ? position.coords.speed : null
        let heading = position.coords.heading !== null && !isNaN(position.coords.heading) && position.coords.heading >= 0
          ? Math.round(position.coords.heading)
          : null

        if (heading === null && userLocation.value) {
          const dist = calculateDistanceKm(userLocation.value, coords)
          if (dist.distanceMeters >= 2) {
            heading = Math.round(calculateBearing(userLocation.value, coords))
          }
        }

        userLocation.value = coords
        locationAccuracy.value = accuracy
        lastPositionUpdateTime = now
        userSpeed.value = speed
        if (heading !== null) {
          userHeading.value = heading
        }

        isLocating.value = false
        locationError.value = null
        resolve(coords)
      }

      const errorHandler = (error: GeolocationPositionError) => {
        isLocating.value = false
        let msg = 'Failed to get your location.'
        if (error.code === error.PERMISSION_DENIED) {
          if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            msg = 'Location blocked: Mobile browsers require HTTPS (or http://localhost:3000 on PC) to access GPS.'
          } else {
            msg = 'Location access was denied. Please allow location permissions in your browser settings for this site.'
          }
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable. Please check your device location if turned on.'
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please ensure GPS is turned on and tap "Use My Device GPS" again.'
        }
        locationError.value = msg
        reject(new Error(msg))
      }

      const startWatching = () => {
        startOrientationListening()
        if (options?.watch && navigator.geolocation.watchPosition) {
          if (watchId.value !== null) {
            navigator.geolocation.clearWatch(watchId.value)
          }
          watchId.value = navigator.geolocation.watchPosition(
            (p) => {
              const newAccuracy = p.coords.accuracy
              const now = Date.now()

              // GPS stabilization: reject coarser readings and debounce rapid updates
              if (locationAccuracy.value !== null) {
                const accuracyDegradationLimit = locationAccuracy.value * 3
                if (newAccuracy > accuracyDegradationLimit && newAccuracy > 100) {
                  return
                }
                const elapsed = now - lastPositionUpdateTime
                const isMoreAccurate = newAccuracy < locationAccuracy.value
                if (elapsed < POSITION_UPDATE_COOLDOWN_MS && !isMoreAccurate) {
                  return
                }
              }

              const newCoords = {
                lat: p.coords.latitude,
                lng: p.coords.longitude
              }
              const newSpeed = p.coords.speed !== null && !isNaN(p.coords.speed) ? p.coords.speed : null
              let newHeading = p.coords.heading !== null && !isNaN(p.coords.heading) && p.coords.heading >= 0
                ? Math.round(p.coords.heading)
                : null

              if (newHeading === null && userLocation.value) {
                const dist = calculateDistanceKm(userLocation.value, newCoords)
                if (dist.distanceMeters >= 2) {
                  newHeading = Math.round(calculateBearing(userLocation.value, newCoords))
                }
              }

              userLocation.value = newCoords
              locationAccuracy.value = newAccuracy
              lastPositionUpdateTime = now
              userSpeed.value = newSpeed
              if (newHeading !== null) {
                userHeading.value = newHeading
              }
            },
            (err) => {
              console.warn('Geolocation watch update:', err)
            },
            {
              enableHighAccuracy: true,
              timeout: 25000,
              maximumAge: 10000
            }
          )
          isLiveTracking.value = true
        }
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          successHandler(pos)
          startWatching()
        },
        (err) => {
          if (err.code === err.TIMEOUT || err.code === err.POSITION_UNAVAILABLE) {
            navigator.geolocation.getCurrentPosition(
              (fallbackPos) => {
                successHandler(fallbackPos)
                startWatching()
              },
              (finalErr) => {
                errorHandler(finalErr)
              },
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 30000
              }
            )
          } else {
            errorHandler(err)
          }
        },
        {
          enableHighAccuracy: options?.enableHighAccuracy ?? true,
          timeout: 25000,
          maximumAge: 30000
        }
      )
    })
  }

  const toggleLiveTracking = async () => {
    if (isLiveTracking.value) {
      stopTracking()
    } else {
      try {
        await requestUserLocation({ enableHighAccuracy: true, watch: true })
      } catch {
      }
    }
  }

  const clearRoute = () => {
    activeFacilityId.value = null
    routeCalculationResult.value = null
  }

  return {
    facilitiesData,
    emergencyHotlines: EMERGENCY_HOTLINES,
    categories,
    subCategories,
    categoryCounts,
    searchQuery,
    selectedCategory,
    selectedSubCategory,
    selectedBarangay,
    viewMode,
    currentPage,
    itemsPerPage,
    activeFacilityId,
    selectedFacility,
    filteredFacilities,
    paginatedFacilities,
    mapMarkers,
    userLocation,
    locationAccuracy,
    locationSource,
    userHeading,
    userSpeed,
    isLocating,
    locationError,
    isLiveTracking,
    routeOrigin,
    routeDestination,
    routeCalculationResult,
    selectCategory,
    selectSubCategory,
    selectBarangay,
    selectFacility,
    requestUserLocation,
    toggleLiveTracking,
    stopTracking,
    setUserLocation,
    calculateDistanceToUser,
    clearRoute
  }
}
