import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

let loadPromise: Promise<void> | null = null

export interface MarkerConfig {
  position?: google.maps.LatLngLiteral
  address?: string
  title?: string
  icon?: string | google.maps.Icon | google.maps.Symbol
  onClick?: () => void
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

  return { isLoaded, loadError, loadGoogleMaps, createMap, createMarker, geocodeAddress, getNearestPanorama }
}