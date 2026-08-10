import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

let loadPromise: Promise<void> | null = null

export interface MarkerConfig {
  position?: google.maps.LatLngLiteral
  address?: string
  title?: string
  icon?: string | google.maps.Icon | google.maps.Symbol
  infoWindowContent?: string
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

    const apiKey = config.public.googleMapsApiKey as string
    if (!apiKey) {
      const msg = 'Missing NUXT_PUBLIC_GOOGLE_MAPS_API_KEY'
      loadError.value = msg
      return Promise.reject(new Error(msg))
    }

    setOptions({
      key: apiKey,
      v: 'weekly',
    })

    loadPromise = Promise.all([
      importLibrary('maps'),
      importLibrary('marker'),
      importLibrary('places'),
      importLibrary('geocoding'),
      importLibrary('streetView'),
      importLibrary('routes'),
    ])
      .then(() => {
        isLoaded.value = true
      })
      .catch((err) => {
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
      mapTypeId: 'hybrid',
      ...options,
    })
  }

  async function geocodeAddress(address: string): Promise<google.maps.LatLngLiteral | null> {
    await loadGoogleMaps()
    const geocoder = new google.maps.Geocoder()
    try {
      const response = await geocoder.geocode({ address })
      if (response.results.length > 0 && response.results[0]?.geometry?.location) {
        const loc = response.results[0].geometry.location
        return { lat: loc.lat(), lng: loc.lng() }
      }
    } catch (err) {
      console.error(`Geocoding error for address "${address}":`, err)
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
      console.warn(`Marker missing position and address could not be resolved`, cfg)
      position = { lat: 0, lng: 0 }
    }
    const marker = new google.maps.Marker({
      map,
      position,
      title: cfg.title || cfg.address,
      icon: cfg.icon,
    })
    if (cfg.onClick) marker.addListener('click', cfg.onClick)
    return marker
  }

  async function getNearestPanorama(
    location: google.maps.LatLng | google.maps.LatLngLiteral,
    radius = 2000
  ): Promise<google.maps.LatLngLiteral | null> {
    await loadGoogleMaps()
    return new Promise((resolve) => {
      const sv = new google.maps.StreetViewService()
      sv.getPanorama(
        { location, radius },
        (data, status) => {
          if (status === google.maps.StreetViewStatus.OK && data?.location?.latLng) {
            resolve({ lat: data.location.latLng.lat(), lng: data.location.latLng.lng() })
          } else {
            resolve(null)
          }
        }
      )
    })
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
    travelModeStr: string = 'DRIVING'
  ): Promise<RouteCalculationResult | null> {
    await loadGoogleMaps()

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
      console.warn('Origin or Destination coordinates could not be resolved for directions')
      return null
    }

    const mode =
      typeof google !== 'undefined' && google.maps && google.maps.TravelMode
        ? (google.maps.TravelMode as any)[travelModeStr] || google.maps.TravelMode.DRIVING
        : ('DRIVING' as any)

    if (typeof google !== 'undefined' && google.maps && google.maps.DirectionsService) {
      try {
        const ds = new google.maps.DirectionsService()
        const result = await new Promise<google.maps.DirectionsResult | null>((resolve) => {
          ds.route(
            {
              origin: originPos,
              destination: destPos,
              travelMode: mode,
            },
            (res, status) => {
              if (status === google.maps.DirectionsStatus.OK && res) {
                resolve(res)
              } else {
                resolve(null)
              }
            }
          )
        })

        if (result && result.routes && result.routes.length > 0) {
          const route = result.routes[0]
          const leg = route?.legs?.[0]

          const steps: RouteStep[] = (leg?.steps || []).map((s) => ({
            instructions: s.instructions.replace(/<[^>]*>/g, ''), // strip html tags for display
            distance: s.distance?.text || '',
            duration: s.duration?.text || '',
          }))

          const path: google.maps.LatLngLiteral[] = (route?.overview_path || []).map((pt) => ({
            lat: pt.lat(),
            lng: pt.lng(),
          }))

          return {
            directionsResult: result,
            distanceText: leg?.distance?.text || '',
            durationText: leg?.duration?.text || '',
            distanceMeters: leg?.distance?.value || 0,
            durationSeconds: leg?.duration?.value || 0,
            steps,
            path,
            isFallbackPolyline: false,
          }
        }
      } catch (err) {
        console.warn('DirectionsService request failed, falling back to direct polyline:', err)
      }
    }

    // Direct polyline fallback
    const directStats = calculateDirectDistance(originPos, destPos)
    return {
      directionsResult: null,
      distanceText: directStats.distanceText,
      durationText: directStats.durationText,
      distanceMeters: directStats.distanceMeters,
      durationSeconds: directStats.durationSeconds,
      steps: [
        {
          instructions: `Direct path from origin to destination`,
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
    getNearestPanorama,
    calculateDirections,
  }
}