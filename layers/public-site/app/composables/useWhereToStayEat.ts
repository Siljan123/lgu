import { ref, computed, watch } from 'vue'
import rawCoordinatesData from '../../coordinates.json'
import type { LocationSourceType, LocationSourceInfo } from './useEmergency'

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

export const useWhereToStayEat = () => {
  const searchQuery = ref('')
  const selectedMainCategory = ref<string>('All')
  const selectedSubCategory = ref<string>('All')
  const selectedBarangay = ref<string>('All')
  const viewMode = ref<'grid' | 'table'>('grid')
  const activeEstablishmentId = ref<string | null>(null)

  const currentPage = ref(1)
  const itemsPerPage = ref(9)

  // Geolocation & Route State
  const userLocation = ref<{ lat: number; lng: number } | null>(null)
  const locationAccuracy = ref<number | null>(null)
  const isLocating = ref(false)
  const locationError = ref<string | null>(null)
  const isLiveTracking = ref(false)
  const travelMode = ref<'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT'>('DRIVING')
  const routeCalculationResult = ref<any | null>(null)
  const watchId = ref<number | null>(null)

  // GPS stabilization: tracks the timestamp of the last accepted position update
  // to debounce rapid interleaved fixes from different sources (IP/Wi-Fi/satellite).
  let lastPositionUpdateTime = 0
  const POSITION_UPDATE_COOLDOWN_MS = 2000

  // Map coordinates.json entries belonging to Where to Stay or Where to Eat
  const establishmentsData: Establishment[] = (rawCoordinatesData as any[]).reduce<Establishment[]>((acc, item) => {
    const classification = classifyEstablishment(item.category || '', item.name || '')
    if (!classification) return acc

    const phone = extractPhone(item.short_description || '')
    const addressStr = item.short_description || 'San Francisco, Agusan del Sur'

    let hours: string | undefined = undefined
    if (item.opening && item.closing) {
      hours = `${item.opening} - ${item.closing}`
    }

    acc.push({
      id: item.id || `json-${item.lat}-${item.lng}`,
      name: item.name,
      mainCategory: classification.mainCategory,
      subCategory: classification.subCategory,
      category: classification.subCategory,
      address: addressStr,
      contactNo: phone,
      barangay: addressStr,
      operatingHours: hours,
      coordinates: { lat: Number(item.lat), lng: Number(item.lng) },
      image: item.photoUrls && item.photoUrls.length > 0 ? item.photoUrls[0] : undefined,
      photoUrls: item.photoUrls || []
    })
    return acc
  }, [])

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
  const mainCategoryCounts = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = {
      All: establishmentsData.length,
      'Where to Stay': 0,
      'Where to Eat': 0
    }
    establishmentsData.forEach(item => {
      const cat = item.mainCategory
      counts[cat] = (counts[cat] ?? 0) + 1
    })
    return counts
  })

  const categoryCounts = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = { All: establishmentsData.length }
    ALL_SUBCATEGORIES.forEach(sc => { counts[sc] = 0 })
    counts['Where to Stay'] = mainCategoryCounts.value['Where to Stay'] ?? 0
    counts['Where to Eat'] = mainCategoryCounts.value['Where to Eat'] ?? 0

    establishmentsData.forEach(item => {
      const subCat = item.subCategory
      counts[subCat] = (counts[subCat] ?? 0) + 1
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

  const allEstablishmentMarkers = computed(() => {
    return filteredEstablishments.value
      .filter(item => item.coordinates)
      .map(item => ({
        address: item.address,
        title: `${item.name} — ${item.address}`,
        position: { lat: item.coordinates.lat, lng: item.coordinates.lng },
        isUserLocation: false,
        infoWindowContent: `
          <div style="padding: 8px 12px; max-width: 240px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #85181a; margin-bottom: 2px;">${item.subCategory || item.category}</div>
            <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 3px 0; line-height: 1.3;">${item.name}</h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">${item.address}</p>
            ${item.contactNo ? `<div style="font-size: 11px; color: #1e293b; font-weight: 600;">${item.contactNo}</div>` : ''}
          </div>
        `
      }))
  })

  // Detect whether location originates from orbital Satellite GPS , Wi-Fi, or Network IP
  const locationSource = computed<LocationSourceInfo | null>(() => {
    if (!userLocation.value || locationAccuracy.value === null) return null

    const acc = Math.round(locationAccuracy.value)
    const accText = acc < 1000 ? `±${acc}m` : `±${(acc / 1000).toFixed(1)}km`

    if (acc <= 20) {
      return {
        type: 'satellite',
        label: 'Satellite GPS',
        shortLabel: 'Satellite GPS',
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
        shortLabel: 'Wi-Fi Network',
        description: 'Estimated via nearby Wi-Fi network beacons (neighborhood-level accuracy)',
        accuracyMeters: acc,
        accuracyRadiusText: accText,
        isHighPrecision: false,
        color: '#2563eb',
      }
    }

    return {
      type: 'network',
      label: 'IP Network',
      shortLabel: 'IP Network',
      description: 'Estimated from ISP public IP address ',
      accuracyMeters: acc,
      accuracyRadiusText: accText,
      isHighPrecision: false,
      color: '#d97706',
    }
  })

  // Focused map markers: only show Starting Point and the Chosen Destination (No marker clutter)
  const mapMarkers = computed(() => {
    const markers: Array<{
      address: string
      title: string
      position: { lat: number; lng: number }
      isUserLocation?: boolean
      infoWindowContent?: string
    }> = []

    if (userLocation.value) {
      const sourceBadgeHtml = locationSource.value ? `
        <div style="display: inline-block; font-size: 10px; font-weight: 600; color: ${locationSource.value.color}; margin-bottom: 6px; background: rgba(0,0,0,0.04); padding: 2px 6px; border-radius: 4px;">
          ${locationSource.value.type === 'satellite' ? 'Satellite GPS' : 'IP Network'})
        </div>
      ` : ''

      markers.push({
        address: locationSource.value?.type === 'satellite' ? 'Your Device Satellite GPS Location' : 'Your Device IP Network Location',
        title: locationSource.value?.type === 'satellite' ? 'Starting Point (Satellite GPS)' : 'Starting Point (IP Network)',
        position: userLocation.value,
        isUserLocation: true,
        infoWindowContent: `
          <div style="padding: 8px 12px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-size: 10px; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 2px;">Starting Point</div>
            <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 2px 0;">Your Device GPS Location</h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">Lat: ${userLocation.value.lat.toFixed(5)}, Lng: ${userLocation.value.lng.toFixed(5)}</p>
            ${sourceBadgeHtml}
            <div style="display: flex; gap: 6px; margin-top: 4px;">
              <button type="button" onclick="if(window.closeGoogleMapInfoWindow)window.closeGoogleMapInfoWindow()" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 8px; font-size: 10px; font-weight: 600; color: #ffffff; background-color: #10b981; border: none; border-radius: 4px; cursor: pointer;">
                Close
              </button>
            </div>
          </div>
        `
      })
    }

    if (selectedEstablishment.value?.coordinates) {
      const est = selectedEstablishment.value
      markers.push({
        address: est.address,
        title: `${est.name} — ${est.address}`,
        position: { lat: est.coordinates.lat, lng: est.coordinates.lng },
        isUserLocation: false,
        infoWindowContent: `
          <div style="padding: 8px 12px; max-width: 240px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #85181a; margin-bottom: 2px;">${est.subCategory || est.category}</div>
            <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 3px 0; line-height: 1.3;">${est.name}</h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">${est.address}</p>
            ${est.contactNo ? `<div style="font-size: 11px; color: #1e293b; font-weight: 600; margin-top: 4px;">${est.contactNo}</div>` : ''}
            ${est.operatingHours ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;"> ${est.operatingHours}</div>` : ''}
            <div style="margin-top: 8px; display: flex; gap: 6px;">
              <button type="button" onclick="if(window.closeGoogleMapInfoWindow)window.closeGoogleMapInfoWindow()" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 8px; font-size: 10px; font-weight: 600; color: #ffffff; background-color: #85181a; border: none; border-radius: 4px; cursor: pointer;">
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
  const routeDestination = computed(() => selectedEstablishment.value?.coordinates || null)

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

  const setUserLocation = (coords: { lat: number; lng: number } | null, accuracy: number | null = null) => {
    userLocation.value = coords
    locationAccuracy.value = accuracy
    if (coords) {
      locationError.value = null
    }
  }

  const calculateDistanceToUser = (targetCoords: { lat: number; lng: number }) => {
    if (!userLocation.value) return null
    return calculateDistanceKm(userLocation.value, targetCoords)
  }

  const stopTracking = () => {
    if (typeof window !== 'undefined' && watchId.value !== null && navigator?.geolocation) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
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

        userLocation.value = coords
        locationAccuracy.value = accuracy
        lastPositionUpdateTime = now
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
          msg = 'Location information is unavailable. Please check your device location / GPS settings.'
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please ensure GPS is turned on and tap "Use My Device GPS" again.'
        }
        locationError.value = msg
        reject(new Error(msg))
      }

      const startWatching = () => {
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

              userLocation.value = {
                lat: p.coords.latitude,
                lng: p.coords.longitude
              }
              locationAccuracy.value = newAccuracy
              lastPositionUpdateTime = now
            },
            (err) => {
              console.warn('Geolocation watch update:', err)
            },
            {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 10000
            }
          )
          isLiveTracking.value = true
        }
      }

      // Fresh, accurate hardware GPS request (maximumAge: 0 bypasses stale cached cell tower coords)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          successHandler(pos)
          startWatching()
        },
        (err) => {
          // If high accuracy GPS timed out, fallback to standard accuracy with maximumAge: 0
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
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 0
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
      } catch (e) {
        // error already recorded in locationError
      }
    }
  }

  const clearRoute = () => {
    activeEstablishmentId.value = null
    routeCalculationResult.value = null
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
    allEstablishmentMarkers,
    userLocation,
    locationAccuracy,
    locationSource,
    isLocating,
    locationError,
    isLiveTracking,
    travelMode,
    routeOrigin,
    routeDestination,
    routeCalculationResult,
    selectMainCategory,
    selectSubCategory,
    selectCategory,
    selectBarangay,
    selectEstablishment,
    requestUserLocation,
    toggleLiveTracking,
    stopTracking,
    setUserLocation,
    calculateDistanceToUser,
    clearRoute
  }
}

