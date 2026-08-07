<script setup lang="ts">
import { ref, shallowRef, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'

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
}

const props = withDefaults(defineProps<Props>(), {
  center: () => ({ lat: 8.5042, lng: 125.9786 }),
  zoom: 15,
  markers: () => [],
  height: '300px',
  showSearch: false,
  searchPlaceholder: 'Search location or address…',
  showStreetViewBtn: true,
})

const emit = defineEmits<{
  ready: [map: google.maps.Map]
  'marker-click': [marker: google.maps.Marker, index: number]
  click: [event: google.maps.MapMouseEvent]
  search: [result: { address: string; location: google.maps.LatLngLiteral }]
  'streetview-change': [active: boolean]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const searchLoading = ref(false)
const searchMarker = shallowRef<google.maps.Marker | null>(null)
const isStreetViewActive = ref(false)

const map = shallowRef<google.maps.Map | null>(null)
const mapMarkers = shallowRef<google.maps.Marker[]>([])
const pending = ref(true)
const error = ref<string | null>(null)

const { loadGoogleMaps, createMap, createMarker, geocodeAddress, getNearestPanorama } = useGoogleMaps()

async function renderMarkers() {
  if (!map.value) return
  mapMarkers.value.forEach(m => m.setMap(null))
  const createdMarkers = await Promise.all(
    props.markers.map(async (cfg, index) => {
      const marker = await createMarker(map.value!, {
        ...cfg,
        onClick: () => {
          cfg.onClick?.()
          emit('marker-click', marker, index)
        },
      })
      return marker
    })
  )
  mapMarkers.value = createdMarkers
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
      streetViewControl: true,
      ...props.mapOptions,
    })

    map.value.addListener('click', (e: google.maps.MapMouseEvent) => emit('click', e))
    setupStreetViewListener()

    await renderMarkers()
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

onBeforeUnmount(() => {
  mapMarkers.value.forEach(m => m.setMap(null))
  if (searchMarker.value) searchMarker.value.setMap(null)
})
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] shadow-md bg-[#ffffff] dark:bg-[#202020]" :style="{ height }">
    <!-- Map Canvas -->
    <div ref="mapContainer" class="h-full w-full" />

    <!-- Optional Floating Controls (Street View toggle) -->
    <div
      v-if="!pending && !error && showStreetViewBtn"
      class="absolute top-3 right-3 z-10"
    >
      <button
        type="button"
        @click="toggleStreetView"
        class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-[#dfdfdf] dark:border-[#333333] shadow-md transition-colors bg-[#ffffff]/95 dark:bg-[#1c1c1c]/95 backdrop-blur-md hover:bg-[#fafafa] text-[#171717] dark:text-[#ffffff]"
        :class="{ 'ring-2 ring-[#85181a] bg-[#85181a]/10': isStreetViewActive }"
        :title="isStreetViewActive ? 'Exit Street View' : 'Open Street View'"
      >
        <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a3 3 0 00-3 3v3.5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V5a3 3 0 00-3-3zM9.5 10A1.5 1.5 0 008 11.5V17a1 1 0 001 1h1v4a1 1 0 002 0v-4h1a1 1 0 001-1v-5.5a1.5 1.5 0 00-1.5-1.5h-5z" />
        </svg>
        <span>{{ isStreetViewActive ? 'Exit Street View' : 'Street View' }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="absolute inset-0 flex items-center justify-center bg-[#ffffff]/60 dark:bg-[#171717]/60 backdrop-blur-xs">
      <span class="text-sm font-semibold text-[#707070] dark:text-[#a3a3a3]">Loading Map…</span>
    </div>

    <!-- Error State -->
    <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-red-500/10 px-4 text-center">
      <span class="text-sm text-red-600 font-medium">{{ error }}</span>
    </div>
  </div>
</template>