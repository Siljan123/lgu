<script setup lang="ts">
import { ref, shallowRef, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'
import type { RouteCalculationResult } from '../composables/useGooglemaps'

export interface CustomSuggestion {
  id?: string
  title: string
  subtitle?: string
  category?: string
  address?: string
  location?: google.maps.LatLngLiteral
  item?: any
}

interface Props {
  center?: google.maps.LatLngLiteral
  centerAddress?: string
  zoom?: number
  markers?: MarkerConfig[]
  mapOptions?: Partial<google.maps.MapOptions>
  height?: string
  showSearch?: boolean
  searchPlaceholder?: string
  showStreetViewBtn?: boolean
  routeOrigin?: google.maps.LatLngLiteral | string | null
  routeDestination?: google.maps.LatLngLiteral | string | null
  routeOriginTitle?: string
  routeDestinationTitle?: string
  showRouteSummary?: boolean
  mapTypeId?: 'hybrid' | 'roadmap' | 'satellite' | 'terrain'
}

const props = withDefaults(defineProps<Props>(), {
  center: () => ({ lat: 8.5042, lng: 125.9786 }),
  zoom: 15,
  markers: () => [],
  height: '300px',
  showSearch: false,
  searchPlaceholder: 'Search location or address…',
  showStreetViewBtn: true,
  routeOrigin: null,
  routeDestination: null,
  routeOriginTitle: '',
  routeDestinationTitle: '',
  travelMode: 'DRIVING',
  showRouteSummary: true,
  mapTypeId: 'roadmap',
})

const emit = defineEmits<{
  ready: [map: google.maps.Map]
  'marker-click': [marker: google.maps.Marker, index: number]
  click: [event: google.maps.MapMouseEvent]
  search: [result: { address: string; location: google.maps.LatLngLiteral }]
  'streetview-change': [active: boolean]
  'route-calculated': [result: RouteCalculationResult | null]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const searchLoading = ref(false)
const searchMarker = shallowRef<google.maps.Marker | null>(null)
const isStreetViewActive = ref(false)

const map = shallowRef<google.maps.Map | null>(null)
const mapMarkers = shallowRef<google.maps.Marker[]>([])
const activeInfoWindow = shallowRef<google.maps.InfoWindow | null>(null)
const pending = ref(true)
const error = ref<string | null>(null)

const directionsRenderer = shallowRef<google.maps.DirectionsRenderer | null>(null)
const routePolyline = shallowRef<google.maps.Polyline | null>(null)
const routeStartMarker = shallowRef<google.maps.Marker | null>(null)
const routeEndMarker = shallowRef<google.maps.Marker | null>(null)

const currentRouteResult = ref<RouteCalculationResult | null>(null)
const routeLoading = ref(false)
const lastCalculatedOrigin = ref<google.maps.LatLngLiteral | string | null>(null)
const lastCalculatedDestination = ref<google.maps.LatLngLiteral | string | null>(null)

const { loadGoogleMaps, createMap, createMarker, geocodeAddress,  calculateDirections } = useGoogleMaps()

function getUserLocationSymbol(heading?: number | null): google.maps.Symbol | undefined {
  if (typeof google === 'undefined' || !google.maps) return undefined

  const rotation = heading !== null && heading !== undefined && !isNaN(heading) ? heading : 0

  // Google Maps navigation directional chevron arrow heading in the user's front direction
  return {
    path: 'M 0 -16 L 9 10 L 0 4 L -9 10 Z',
    fillColor: '#2563eb', // Google Maps navigation blue
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2.5,
    scale: 1.3,
    rotation,
    anchor: new google.maps.Point(0, 0),
  }
}

async function renderMarkers() {
  if (!map.value) return

  // In-place update check to prevent full tear-down jitter when GPS coordinates/heading change
  const canUpdateInPlace =
    mapMarkers.value.length === props.markers.length &&
    mapMarkers.value.length > 0 &&
    props.markers.every((cfg, i) => {
      const m = mapMarkers.value[i]
      return m && Boolean(cfg.isUserLocation) === Boolean((m as any)._isUserLocation)
    })

  if (canUpdateInPlace) {
    props.markers.forEach((cfg, index) => {
      const marker = mapMarkers.value[index]
      if (!marker) return
      if (cfg.position) {
        marker.setPosition(cfg.position)
      }
      if (cfg.isUserLocation) {
        const symbol = cfg.icon || getUserLocationSymbol(cfg.heading)
        if (symbol) marker.setIcon(symbol)
      } else if (cfg.icon) {
        marker.setIcon(cfg.icon)
      }
      if (cfg.title) marker.setTitle(cfg.title)
    })
    return
  }

  if (activeInfoWindow.value) {
    activeInfoWindow.value.close()
    activeInfoWindow.value = null
  }
  mapMarkers.value.forEach(m => m.setMap(null))
  const createdMarkers = await Promise.all(
    props.markers.map(async (cfg, index) => {
      const icon = cfg.icon || (cfg.isUserLocation ? getUserLocationSymbol(cfg.heading) : undefined)
      const marker = await createMarker(map.value!, {
        ...cfg,
        icon,
        onClick: () => {
          if (cfg.infoWindowContent && typeof google !== 'undefined' && google.maps) {
            if (activeInfoWindow.value) activeInfoWindow.value.close()
            activeInfoWindow.value = new google.maps.InfoWindow({
              content: cfg.infoWindowContent,
            })
            activeInfoWindow.value.open(map.value!, marker)
          }
          cfg.onClick?.()
          emit('marker-click', marker, index)
        },
      })
      ;(marker as any)._isUserLocation = Boolean(cfg.isUserLocation)
      return marker
    })
  )
  mapMarkers.value = createdMarkers
}

function clearRouteGraphics() {
  if (directionsRenderer.value) {
    directionsRenderer.value.setMap(null)
    directionsRenderer.value = null
  }
  if (routePolyline.value) {
    routePolyline.value.setMap(null)
    routePolyline.value = null
  }
  if (routeStartMarker.value) {
    routeStartMarker.value.setMap(null)
    routeStartMarker.value = null
  }
  if (routeEndMarker.value) {
    routeEndMarker.value.setMap(null)
    routeEndMarker.value = null
  }
  currentRouteResult.value = null
}

async function renderRoutePath() {
  if (!map.value) return
  if (!props.routeOrigin || !props.routeDestination) {
    clearRouteGraphics()
    lastCalculatedOrigin.value = null
    lastCalculatedDestination.value = null
    emit('route-calculated', null)
    return
  }

  // Check if route origin moved less than 20m and destination is identical
  if (
    lastCalculatedOrigin.value &&
    lastCalculatedDestination.value &&
    typeof props.routeOrigin === 'object' &&
    typeof lastCalculatedOrigin.value === 'object' &&
    props.routeDestination === lastCalculatedDestination.value
  ) {
    const p1 = props.routeOrigin as google.maps.LatLngLiteral
    const p2 = lastCalculatedOrigin.value as google.maps.LatLngLiteral
    const R = 6371e3
    const φ1 = (p1.lat * Math.PI) / 180
    const φ2 = (p2.lat * Math.PI) / 180
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180
    const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const meters = R * c
    if (meters < 50) {
      return
    }
  }

  routeLoading.value = true
  try {
    clearRouteGraphics()
    const result = await calculateDirections(props.routeOrigin, props.routeDestination)
    if (!result || !map.value) {
      emit('route-calculated', null)
      return
    }

    lastCalculatedOrigin.value = props.routeOrigin
    lastCalculatedDestination.value = props.routeDestination
    currentRouteResult.value = result

    if (result.directionsResult && typeof google !== 'undefined' && google.maps && google.maps.DirectionsRenderer) {
      directionsRenderer.value = new google.maps.DirectionsRenderer({
        map: map.value,
        suppressMarkers: true,
        preserveViewport: Boolean(result.distanceMeters && result.distanceMeters > 100000),
        polylineOptions: {
          strokeColor: '#85181a',
          strokeWeight: 5,
          strokeOpacity: 0.85,
        },
      })
      directionsRenderer.value.setDirections(result.directionsResult)

      if (props.markers.length === 0) {
        const leg = result.directionsResult.routes?.[0]?.legs?.[0]
        const originLoc = leg?.start_location
        const destLoc = leg?.end_location

        if (originLoc) {
          routeStartMarker.value = new google.maps.Marker({
            map: map.value,
            position: originLoc,
            title: props.routeOriginTitle || leg?.start_address || 'Starting Location',
          })
        }
        if (destLoc) {
          routeEndMarker.value = new google.maps.Marker({
            map: map.value,
            position: destLoc,
            title: props.routeDestinationTitle || leg?.end_address || 'Destination',
          })
        }
      }
    } else if (result.path && result.path.length > 0) {
      // Custom Polyline Fallback
      routePolyline.value = new google.maps.Polyline({
        map: map.value,
        path: result.path,
        strokeColor: '#85181a',
        strokeOpacity: 0.85,
        strokeWeight: 5,
        geodesic: true,
      })

      const originPt = result.path[0]!
      const destPt = result.path[result.path.length - 1]!

      if (props.markers.length === 0) {
        routeStartMarker.value = new google.maps.Marker({
          map: map.value,
          position: originPt,
          title: props.routeOriginTitle || (typeof props.routeOrigin === 'string' ? props.routeOrigin : 'Starting Location'),
        })

        routeEndMarker.value = new google.maps.Marker({
          map: map.value,
          position: destPt,
          title: props.routeDestinationTitle || (typeof props.routeDestination === 'string' ? props.routeDestination : 'Destination'),
        })
      }

      if (typeof google !== 'undefined' && google.maps && google.maps.LatLngBounds) {
        const bounds = new google.maps.LatLngBounds()
        result.path.forEach(p => bounds.extend(p))
        if (!result.distanceMeters || result.distanceMeters <= 100000) {
          map.value.fitBounds(bounds)
        } else if (destPt) {
          map.value.panTo(destPt)
          map.value.setZoom(15)
        }
      }
    }

    emit('route-calculated', result)
  } catch (err) {
    console.error('Failed to render route path:', err)
    emit('route-calculated', null)
  } finally {
    routeLoading.value = false
  }
}

function initAutocomplete() {
  if (!searchInput.value || !map.value || typeof google === 'undefined' || !google.maps.places) return
  try {
    const autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
      fields: ['geometry', 'name', 'formatted_address'],
    })
    autocomplete.bindTo('bounds', map.value)

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry || !place.geometry.location) {
        handleSearchSubmit()
        return
      }
      const loc = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
      const label = place.name || place.formatted_address || searchQuery.value
      searchQuery.value = label
      applySearchResult(loc, label)
    })
  } catch (err) {
    console.warn('Failed to initialize Places Autocomplete:', err)
  }
}

async function handleSearchSubmit() {
  if (!searchQuery.value.trim() || !map.value) return
  searchLoading.value = true
  try {
    const coords = await geocodeAddress(searchQuery.value)
    if (coords) {
      applySearchResult(coords, searchQuery.value)
    } else {
      console.warn(`Location not found for "${searchQuery.value}"`)
    }
  } finally {
    searchLoading.value = false
  }
}

function applySearchResult(location: google.maps.LatLngLiteral, label: string) {
  if (!map.value) return
  map.value.panTo(location)
  map.value.setZoom(17)

  if (searchMarker.value) {
    searchMarker.value.setPosition(location)
    searchMarker.value.setTitle(label)
  } else {
    searchMarker.value = new google.maps.Marker({
      map: map.value,
      position: location,
      title: label,
      animation: google.maps.Animation.DROP,
    })
  }

  emit('search', { address: label, location })
}

function setupStreetViewListener() {
  if (!map.value) return
  const panorama = map.value.getStreetView()
  panorama.addListener('visible_changed', () => {
    isStreetViewActive.value = panorama.getVisible()
    emit('streetview-change', panorama.getVisible())
  })
}

onMounted(async () => {
  if (typeof window !== 'undefined') {
    (window as any).closeGoogleMapInfoWindow = () => {
      if (activeInfoWindow.value) {
        activeInfoWindow.value.close()
        activeInfoWindow.value = null
      }
    }
  }

  try {
    await loadGoogleMaps()
    if (!mapContainer.value) return

    let mapCenter = props.center
    if (props.centerAddress) {
      const geocoded = await geocodeAddress(props.centerAddress)
      if (geocoded) mapCenter = geocoded
    }

    map.value = createMap(mapContainer.value, {
      center: mapCenter,
      zoom: props.zoom,
      mapTypeId: props.mapTypeId,
      streetViewControl: true,
      ...props.mapOptions,
    })

    map.value.addListener('click', (e: google.maps.MapMouseEvent) => emit('click', e))
    setupStreetViewListener()

    await renderMarkers()
    if (props.routeOrigin && props.routeDestination) {
      await renderRoutePath()
    }
    if (props.showSearch) {
      nextTick(() => initAutocomplete())
    }
    if (typeof ResizeObserver !== 'undefined' && mapContainer.value) {
      resizeObserver = new ResizeObserver(() => {
        if (map.value && typeof google !== 'undefined' && google.maps) {
          google.maps.event.trigger(map.value, 'resize')
        }
      })
      resizeObserver.observe(mapContainer.value)
    }

    // Trigger an additional resize tick to guarantee full tile rendering on mobile viewports
    setTimeout(() => {
      if (map.value && typeof google !== 'undefined' && google.maps) {
        google.maps.event.trigger(map.value, 'resize')
        if (mapCenter) map.value.panTo(mapCenter)
      }
    }, 200)

    emit('ready', map.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load Google Maps'
  } finally {
    pending.value = false
  }
})

let resizeObserver: ResizeObserver | null = null

watch(() => props.markers, renderMarkers, { deep: true })
watch(() => props.center, (c) => { if (c) map.value?.panTo(c) })
watch(() => props.centerAddress, async (addr) => {
  if (addr) {
    const coords = await geocodeAddress(addr)
    if (coords) map.value?.panTo(coords)
  }
})
watch(() => props.zoom, (z) => { if (typeof z === 'number') map.value?.setZoom(z) })
watch(() => props.mapOptions, (options) => { if (map.value && options) map.value.setOptions(options) }, { deep: true })

watch([() => props.routeOrigin, () => props.routeDestination], () => {
  renderRoutePath()
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  mapMarkers.value.forEach(m => m.setMap(null))
  if (searchMarker.value) searchMarker.value.setMap(null)
  clearRouteGraphics()
})
</script>

<template>
  <div class="relative w-full min-h-[320px] overflow-hidden rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] shadow-md bg-[#fafafa] dark:bg-[#202020]" :style="{ height }">
    <div ref="mapContainer" class="h-full w-full min-h-[320px]" />

    <div v-if="pending || routeLoading" class="absolute inset-0 flex items-center justify-center bg-[#ffffff]/60 dark:bg-[#171717]/60 backdrop-blur-xs z-20">
      <span class="text-sm font-semibold text-[#707070] dark:text-[#a3a3a3] animate-pulse">
        {{ routeLoading ? 'Calculating Route …' : 'Loading Map…' }}
      </span>
    </div>

    <div v-if="error" class="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10 p-4 text-center z-20 space-y-2">
      <span class="text-sm text-red-600 font-medium">{{ error }}</span>
      <a
        v-if="center"
        :href="`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#85181a] hover:bg-[#a01e21] transition-colors shadow-sm"
      >
        Open in Google Maps App
      </a>
    </div>
  </div>
</template>

<style>
/* Remove native top-right X close button from Google Maps InfoWindow */
.gm-ui-hover-effect {
  display: none !important;
}

/* Adjust InfoWindow content container padding for custom Close button */
.gm-style-iw-c {
  padding-right: 12px !important;
}
</style>