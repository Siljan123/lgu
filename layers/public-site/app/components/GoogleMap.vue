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
  travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT'
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
  travelMode: 'DRIVING',
  showRouteSummary: true,
  mapTypeId: 'hybrid',
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

const { loadGoogleMaps, createMap, createMarker, geocodeAddress, getNearestPanorama, calculateDirections } = useGoogleMaps()

async function renderMarkers() {
  if (!map.value) return
  if (activeInfoWindow.value) {
    activeInfoWindow.value.close()
    activeInfoWindow.value = null
  }
  mapMarkers.value.forEach(m => m.setMap(null))
  const createdMarkers = await Promise.all(
    props.markers.map(async (cfg, index) => {
      const marker = await createMarker(map.value!, {
        ...cfg,
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
    emit('route-calculated', null)
    return
  }

  routeLoading.value = true
  try {
    clearRouteGraphics()
    const result = await calculateDirections(props.routeOrigin, props.routeDestination, props.travelMode)
    if (!result || !map.value) {
      emit('route-calculated', null)
      return
    }

    currentRouteResult.value = result

    if (result.directionsResult && typeof google !== 'undefined' && google.maps && google.maps.DirectionsRenderer) {
      directionsRenderer.value = new google.maps.DirectionsRenderer({
        map: map.value,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#85181a',
          strokeWeight: 5,
          strokeOpacity: 0.85,
        },
      })
      directionsRenderer.value.setDirections(result.directionsResult)
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

      routeStartMarker.value = new google.maps.Marker({
        map: map.value,
        position: originPt,
        title: 'Start Location',
        label: 'A',
      })

      routeEndMarker.value = new google.maps.Marker({
        map: map.value,
        position: destPt,
        title: 'Destination',
        label: 'B',
      })

      if (typeof google !== 'undefined' && google.maps && google.maps.LatLngBounds) {
        const bounds = new google.maps.LatLngBounds()
        result.path.forEach(p => bounds.extend(p))
        map.value.fitBounds(bounds)
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

function clearSearch() {
  searchQuery.value = ''
  if (searchMarker.value) {
    searchMarker.value.setMap(null)
    searchMarker.value = null
  }
}

async function toggleStreetView() {
  if (!map.value) return
  const panorama = map.value.getStreetView()
  const visible = panorama.getVisible()
  if (!visible) {
    const targetLoc = searchMarker.value?.getPosition() || map.value.getCenter()
    if (!targetLoc) return
    const nearest = await getNearestPanorama(targetLoc, 5000)
    panorama.setPosition(nearest || targetLoc)
    panorama.setVisible(true)
  } else {
    panorama.setVisible(false)
  }
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
    emit('ready', map.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load Google Maps'
  } finally {
    pending.value = false
  }
})

watch(() => props.markers, renderMarkers, { deep: true })
watch(() => props.center, (c) => { if (c) map.value?.panTo(c) })
watch(() => props.centerAddress, async (addr) => {
  if (addr) {
    const coords = await geocodeAddress(addr)
    if (coords) map.value?.panTo(coords)
  }
})
watch(() => props.zoom, (z) => { if (typeof z === 'number') map.value?.setZoom(z) })

watch([() => props.routeOrigin, () => props.routeDestination, () => props.travelMode], () => {
  renderRoutePath()
})

onBeforeUnmount(() => {
  mapMarkers.value.forEach(m => m.setMap(null))
  if (searchMarker.value) searchMarker.value.setMap(null)
  clearRouteGraphics()
})
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] shadow-md bg-[#ffffff] dark:bg-[#202020]" :style="{ height }">

    <div ref="mapContainer" class="h-full w-full" />

    <div
      v-if="showRouteSummary && currentRouteResult"
      class="absolute top-2 left-50 z-10 max-w-70 sm:max-w-xs bg-[#ffffff]/90 dark:bg-[#181818]/90 backdrop-blur-md p-3 rounded-xl border border-[#dfdfdf] dark:border-[#333333] shadow-lg text-xs space-y-1.5"
    >
      <div class="flex items-center justify-between text-[#171717] dark:text-[#ffffff] font-medium">
        <span>Distance: <strong>{{ currentRouteResult.distanceText }}</strong></span>
      </div>
      <p v-if="currentRouteResult.isFallbackPolyline" class="text-[10px] text-[#707070] dark:text-[#a3a3a3] italic">
        Direct polyline connecting landmarks
      </p>
    </div>

    <div v-if="pending || routeLoading" class="absolute inset-0 flex items-center justify-center bg-[#ffffff]/60 dark:bg-[#171717]/60 backdrop-blur-xs z-20">
      <span class="text-sm font-semibold text-[#707070] dark:text-[#a3a3a3] animate-pulse">
        {{ routeLoading ? 'Calculating Route Line…' : 'Loading Map…' }}
      </span>
    </div>

    <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-red-500/10 px-4 text-center z-20">
      <span class="text-sm text-red-600 font-medium">{{ error }}</span>
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