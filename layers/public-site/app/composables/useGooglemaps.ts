import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

let loadPromise: Promise<void> | null = null

export interface MarkerConfig {
  id?: string
  position?: google.maps.LatLngLiteral
  address?: string
  title?: string
  icon?: string | google.maps.Icon | google.maps.Symbol
  infoWindowContent?: string
  isUserLocation?: boolean
  heading?: number | null
  zIndex?: number
  animation?: any
  onClick?: () => void
}

export interface RouteStep {
  instructions: string
  distance: string
  duration: string
}

export interface RouteCalculationResult {
  directionsResult?: google.maps.DirectionsResult | null
  distanceText: string
  durationText: string
  distanceMeters: number
  durationSeconds: number
  steps: RouteStep[]
  path: google.maps.LatLngLiteral[]
  isFallbackPolyline?: boolean
}

export function useGoogleMaps() {
  const config = useRuntimeConfig()
  const isLoaded = useState('google-maps-loaded', () => false)
  const loadError = useState<string | null>('google-maps-error', () => null)

  function loadGoogleMaps(): Promise<void> {
    if (loadPromise) return loadPromise

    const apiKey = (config.public.googleMapsApiKey ) as string
    if (!apiKey) {
      const msg = 'Missing GOOGLE MAPS API KEY'
      loadError.value = msg
      return Promise.reject(new Error(msg))
    }

    setOptions({
      key: apiKey,
      v: 'weekly',
    })

    // Load only core maps and marker libraries for free-tier interactive display
    loadPromise = Promise.all([
      importLibrary('maps'),
      importLibrary('marker'),
    ])
      .then(() => {
        isLoaded.value = true
      })
      .catch((err) => {
        loadPromise = null
        loadError.value = err instanceof Error ? err.message : 'Failed to load Google Maps'
        throw err
      })

    return loadPromise
  }

  function createMap(container: HTMLElement, options: google.maps.MapOptions): google.maps.Map {
    return new google.maps.Map(container, {
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      mapTypeId: 'roadmap',
      gestureHandling: 'greedy',
      ...options,
    })
  }

  async function geocodeAddress(address: string): Promise<google.maps.LatLngLiteral | null> {
    // Known local coordinate dictionary to eliminate costly Google Geocoding API requests ($5/1k)
    const knownCoordinates: Record<string, google.maps.LatLngLiteral> = {
      'san francisco, agusan del sur': { lat: 8.5042, lng: 125.9786 },
      'san francisco, agusan del sur, philippines': { lat: 8.5042, lng: 125.9786 },
      'san francisco': { lat: 8.5042, lng: 125.9786 },
      'alegria': { lat: 8.5056, lng: 125.9945 },
      'hubang': { lat: 8.5132, lng: 125.9760 },
      'karaos': { lat: 8.5201, lng: 125.9810 },
      'barangay 1': { lat: 8.5042, lng: 125.9786 },
      'barangay 2': { lat: 8.5050, lng: 125.9790 },
      'barangay 3': { lat: 8.5060, lng: 125.9795 },
      'barangay 4': { lat: 8.5070, lng: 125.9800 },
      'barangay 5': { lat: 8.5080, lng: 125.9805 },
    }

    const normalized = (address || '').toLowerCase().trim()
    for (const [key, coords] of Object.entries(knownCoordinates)) {
      if (normalized.includes(key)) {
        return coords
      }
    }

    return null
  }

  async function createMarker(map: google.maps.Map, cfg: MarkerConfig): Promise<google.maps.Marker> {
    let position = cfg.position
    if (!position && cfg.address) {
      const coords = await geocodeAddress(cfg.address)
      if (coords) position = coords
    }
    if (!position) {
      console.warn(`Marker missing position and address could not be resolved locally`, cfg)
      position = { lat: 8.5042, lng: 125.9786 }
    }
    const marker = new google.maps.Marker({
      map,
      position,
      title: cfg.title || cfg.address,
      icon: cfg.icon,
      zIndex: cfg.zIndex,
      animation: cfg.animation,
    })
    if (cfg.onClick) marker.addListener('click', cfg.onClick)
    return marker
  }

  function calculateDirectDistance(
    p1: google.maps.LatLngLiteral,
    p2: google.maps.LatLngLiteral
  ): { distanceText: string; distanceMeters: number; durationText: string; durationSeconds: number } {
    const R = 6371e3 // metres
    const φ1 = (p1.lat * Math.PI) / 180
    const φ2 = (p2.lat * Math.PI) / 180
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180
    const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const meters = Math.round(R * c)
    const km = (meters / 1000).toFixed(1)
    const mins = Math.max(1, Math.round(meters / 500)) // estimated ~30km/h average driving

    return {
      distanceMeters: meters,
      distanceText: meters < 1000 ? `${meters} m` : `${km} km`,
      durationSeconds: mins * 60,
      durationText: `~${mins} min${mins > 1 ? 's' : ''}`,
    }
  }

  async function calculateDirections(
    origin: google.maps.LatLngLiteral | string,
    destination: google.maps.LatLngLiteral | string,
    _travelModeStr: string = 'DRIVING'
  ): Promise<RouteCalculationResult | null> {
    let originPos: google.maps.LatLngLiteral | null = null
    let destPos: google.maps.LatLngLiteral | null = null

    if (typeof origin === 'string') {
      originPos = await geocodeAddress(origin)
    } else {
      originPos = origin
    }

    if (typeof destination === 'string') {
      destPos = await geocodeAddress(destination)
    } else {
      destPos = destination
    }

    if (!originPos || !destPos) {
      console.warn('[useGoogleMaps] Origin or Destination missing coordinates for directions')
      return null
    }

    // Free client-side Haversine direct calculation (0 API cost, no DirectionsService call)
    const directStats = calculateDirectDistance(originPos, destPos)
    return {
      directionsResult: null,
      distanceText: directStats.distanceText,
      durationText: directStats.durationText,
      distanceMeters: directStats.distanceMeters,
      durationSeconds: directStats.durationSeconds,
      steps: [
        {
          instructions: `Direct path to destination (${directStats.distanceText})`,
          distance: directStats.distanceText,
          duration: directStats.durationText,
        },
      ],
      path: [originPos, destPos],
      isFallbackPolyline: true,
    }
  }

  return {
    isLoaded,
    loadError,
    loadGoogleMaps,
    createMap,
    createMarker,
    geocodeAddress,
    calculateDirectDistance,
    calculateDirections,
  }
}
