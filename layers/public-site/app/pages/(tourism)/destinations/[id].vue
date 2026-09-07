<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  MapPin,
  MoveLeft, 
  Locate, 
  LocateFixed, 
  Navigation, 
  Globe, 
  AlertCircle, 
  X 
} from '@lucide/vue'
import { useDestinations } from '../../../composables/useDestinations'
import GoogleMap from '../../../components/GoogleMap.vue'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const { getDestinationById } = useDestinations()

// Read route parameter by id
const destinationId = computed<string>(() => {
  const p = route.params.id ?? (route.params as Record<string, any>).name
  if (Array.isArray(p)) return p[0] ?? ''
  return (p as string) ?? ''
})
const destination = computed(() => getDestinationById(destinationId.value))

if (!destination.value) {
  showError({ statusCode: 404, statusMessage: 'Destination landmark not found' })
}

const activePhotoIndex = ref(0)
const hasImageError = ref(false)

// GPS Device Tracking State
const userLocation = ref<{ lat: number; lng: number } | null>(null)
const locationAccuracy = ref<number | null>(null)
const userHeading = ref<number | null>(null)
const isLocating = ref(false)
const isLiveTracking = ref(false)
const locationError = ref<string | null>(null)
const showLocationError = ref(true)
const watchId = ref<number | null>(null)
const mapCenter = ref<{ lat: number; lng: number } | undefined>(undefined)
const mapZoom = ref(15)
const routeSummary = ref<{ distance?: string; duration?: string } | null>(null)

// Stabilization state to prevent GPS flickering between position sources.
// Tracks the timestamp of the last accepted position update so rapid successive
// callbacks from the browser (which often interleave coarse IP/Wi-Fi fixes with
// precise satellite fixes) are debounced.
let lastPositionUpdateTime = 0
const POSITION_UPDATE_COOLDOWN_MS = 2000 // min ms between accepted updates

onMounted(() => {
  if (destination.value?.coordinates) {
    mapCenter.value = { ...destination.value.coordinates }
  }
  // Automatically initiate device GPS tracking upon landing on the page
  startGpsTracking(true)
})

watch(destinationId, () => {
  activePhotoIndex.value = 0
  hasImageError.value = false
  routeSummary.value = null
  if (destination.value?.coordinates) {
    mapCenter.value = { ...destination.value.coordinates }
  }
})

// Location source detection based on accuracy radius
const locationSource = computed(() => {
  if (!userLocation.value || locationAccuracy.value === null) return null
  const acc = Math.round(locationAccuracy.value)
  const accText = acc < 1000 ? `±${acc}m` : `±${(acc / 1000).toFixed(1)}km`

  if (acc <= 20) {
    return {
      type: 'satellite',
      shortLabel: 'Satellite GPS',
      accuracyRadiusText: accText,
      description: 'Locked onto orbital GPS satellites (precise street-level accuracy)'
    }
  }
  if (acc <= 150) {
    return {
      type: 'wifi',
      shortLabel: 'Wi-Fi Network',
      accuracyRadiusText: accText,
      description: 'Estimated via nearby Wi-Fi network beacons (neighborhood accuracy)'
    }
  }
  return {
    type: 'network',
    shortLabel: 'IP Network',
    accuracyRadiusText: accText,
    description: 'Estimated via ISP / Network gateway'
  }
})

function startGpsTracking(isAuto = false) {
  if (typeof window === 'undefined') return

  if (!navigator?.geolocation) {
    if (!isAuto) {
      locationError.value = 'Geolocation is not supported by your browser or device.'
      showLocationError.value = true
    }
    return
  }

  isLocating.value = true
  locationError.value = null
  showLocationError.value = !isAuto

  /**
   * Guards applied:
   * 1. **Accuracy gate** – once it has a position, reject any new reading
   *    whose accuracy is worse by more than 3× the current best, unless
   *    this is the very first fix (where we accept anything).
   * 2. **Cooldown** – ignore updates that arrive within POSITION_UPDATE_COOLDOWN_MS
   *    of the last accepted update, unless the new reading is strictly more
   *    accurate (better readings always bypass the cooldown).
   */
  const updatePosition = (pos: GeolocationPosition) => {
    const newAccuracy = pos.coords.accuracy
    const now = Date.now()

    // Always accept the very first position fix
    const isFirstFix = userLocation.value === null

    if (!isFirstFix && locationAccuracy.value !== null) {
      // Guard 1: Reject severely degraded accuracy readings.
     
      const accuracyDegradationLimit = locationAccuracy.value * 3
      if (newAccuracy > accuracyDegradationLimit && newAccuracy > 100) {
        return
      }

      // Guard 2: Cooldown — suppress rapid-fire updates unless strictly better.
      const elapsed = now - lastPositionUpdateTime
      const isMoreAccurate = newAccuracy < locationAccuracy.value
      if (elapsed < POSITION_UPDATE_COOLDOWN_MS && !isMoreAccurate) {
        return
      }
    }

    // Accept this position update
    const coords = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    }
    userLocation.value = coords
    locationAccuracy.value = newAccuracy
    lastPositionUpdateTime = now

    if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) {
      userHeading.value = pos.coords.heading
    }

    isLocating.value = false
    isLiveTracking.value = true
    locationError.value = null
  }

  const handleError = (err: GeolocationPositionError) => {
    isLocating.value = false
    let msg = 'Failed to obtain your device GPS coordinates.'
    if (err.code === err.PERMISSION_DENIED) {
      if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        msg = 'Location blocked: Mobile browsers require HTTPS (or localhost) to access device GPS.'
      } else {
        msg = 'Location permission was denied. Tap "Track My Device GPS" to enable route directions.'
      }
    } else if (err.code === err.POSITION_UNAVAILABLE) {
      msg = 'GPS location is unavailable. Please verify that device location/GPS is enabled.'
    } else if (err.code === err.TIMEOUT) {
      msg = 'GPS request timed out. Please check your signal and tap to retry.'
    }
    locationError.value = msg
    showLocationError.value = !isAuto || err.code !== err.PERMISSION_DENIED
  }

  // Quick initial location lock — allow a cached position up to 30s old so the
  // browser can reuse a recent satellite fix instead of forcing a fresh (often
  // coarse IP-based) acquisition from scratch.
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      updatePosition(pos)
    },
    (err) => {
      handleError(err)
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  )

  // Continuous live GPS device tracking — maximumAge of 10s reduces how often
  // the browser falls back to coarse network fixes between satellite updates.
  if (watchId.value !== null) {
    navigator.geolocation.clearWatch(watchId.value)
  }

  watchId.value = navigator.geolocation.watchPosition(
    (pos) => {
      updatePosition(pos)
    },
    (err) => {
      if (!userLocation.value) {
        handleError(err)
      }
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  )
}

function stopGpsTracking() {
  if (typeof window !== 'undefined' && watchId.value !== null && navigator?.geolocation) {
    navigator.geolocation.clearWatch(watchId.value)
    watchId.value = null
  }
  isLiveTracking.value = false
  isLocating.value = false
}

function centerOnUser() {
  if (userLocation.value) {
    mapCenter.value = { ...userLocation.value }
    mapZoom.value = 16
  }
}

function centerOnDestination() {
  if (destination.value?.coordinates) {
    mapCenter.value = { ...destination.value.coordinates }
    mapZoom.value = 15
  }
}

function clearGpsTracking() {
  stopGpsTracking()
  userLocation.value = null
  locationAccuracy.value = null
  userHeading.value = null
  routeSummary.value = null
  locationError.value = null
  lastPositionUpdateTime = 0
  if (destination.value?.coordinates) {
    mapCenter.value = { ...destination.value.coordinates }
    mapZoom.value = 15
  }
}

function scrollToMap() {
  if (typeof document === 'undefined') return
  const el = document.getElementById('map-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const googleMapsNavUrl = computed(() => {
  if (!destination.value?.coordinates) return '#'
  const { lat, lng } = destination.value.coordinates
  if (userLocation.value) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.value.lat},${userLocation.value.lng}&destination=${lat},${lng}`
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
})

function handleRouteCalculated(result: any) {
  if (result?.directionsResult?.routes?.[0]?.legs?.[0]) {
    const leg = result.directionsResult.routes[0].legs[0]
    routeSummary.value = {
      distance: leg.distance?.text,
      duration: leg.duration?.text
    }
  } else if (result?.distanceText) {
    routeSummary.value = {
      distance: result.distanceText,
      duration: result.durationText
    }
  } else {
    routeSummary.value = null
  }
}

onUnmounted(() => {
  stopGpsTracking()
})

const currentImage = computed(() => {
  if (destination.value?.photoUrls && destination.value.photoUrls.length > activePhotoIndex.value) {
    return destination.value.photoUrls[activePhotoIndex.value]
  }
  return destination.value?.image || ''
})


const mapMarkers = computed(() => {
  const markers: Array<{
    position: { lat: number; lng: number }
    title?: string
    isUserLocation?: boolean
    heading?: number | null
    infoWindowContent?: string
  }> = []

  if (destination.value?.coordinates?.lat && destination.value?.coordinates?.lng) {
    markers.push({
      position: destination.value.coordinates,
      title: destination.value.name,
      isUserLocation: false,
      infoWindowContent: `
        <div style="padding: 8px 10px; min-width: 180px; max-width: 240px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #85181a; letter-spacing: 0.05em;">Destination Landmark</div>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 2px 0; line-height: 1.25;">${destination.value.name}</h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0;">Brgy. ${destination.value.barangay}</p>
          <button type="button" onclick="if(window.closeGoogleMapInfoWindow)window.closeGoogleMapInfoWindow()" style="display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 4px 8px; font-size: 11px; font-weight: 600; color: #ffffff; background-color: #85181a; border: none; border-radius: 6px; cursor: pointer;">
            Close
          </button>
        </div>
      `
    })
  }

  if (userLocation.value) {
    markers.push({
      position: userLocation.value,
      title: 'Your Device GPS Location',
      isUserLocation: true,
      heading: userHeading.value,
      infoWindowContent: `
        <div style="padding: 8px 10px; min-width: 180px; max-width: 240px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #10b981; letter-spacing: 0.05em;">Your GPS Location</div>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 2px 0; line-height: 1.25;">Tracked Device</h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0;">${locationAccuracy.value ? `Accuracy: ±${Math.round(locationAccuracy.value)}m` : 'Tracking'}</p>
          <button type="button" onclick="if(window.closeGoogleMapInfoWindow)window.closeGoogleMapInfoWindow()" style="display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 4px 8px; font-size: 11px; font-weight: 600; color: #ffffff; background-color: #10b981; border: none; border-radius: 6px; cursor: pointer;">
            Close
          </button>
        </div>
      `
    })
  }

  return markers
})

useHead({
  title: computed(() => `${destination.value?.name || 'Destination'} — San Francisco, Agusan del Sur`),
  meta: [
    {
      name: 'description',
      content: computed(() => destination.value?.shortDescription || 'San Francisco Agusan del Sur tourist destination.')
    }
  ]
})
const displayDescription = computed(() => {
  if (!destination.value) return ''
  switch (destination.value.category) {
    case 'Churches & Religious Landmarks':
      return destination.value.churchfullDescription
    case 'Day-Tour Resorts / Swimming Spots':
      return destination.value.resortfullDescription
    case 'Sports & Recreation Facilities':
      return destination.value.sportsfullDescription
    case 'Malls/Business establishments':
      return destination.value.mallsfullDescription

  }
})
</script>

<template>
  <div v-if="destination" class="bg-[#ffffff] dark:bg-[#141414] min-h-dvh flex flex-col">
    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div class="lg:col-span-7 space-y-4">
          <div class="rounded-sm overflow-hidden border group border-[#dfdfdf] dark:border-[#2e2e2e] shadow-xl bg-[#fafafa] dark:bg-[#202020] aspect-4/3 relative">
            <NuxtImg 
              v-if="!hasImageError && currentImage"
              :src="currentImage" 
              :alt="destination.name"
              class="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
              loading="eager"
              format="webp"
              @error="hasImageError = true"
            />
            <div 
              v-else 
              class="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-[#2a2a2a] via-[#1c1c1c] to-[#121212] text-[#a3a3a3] p-6 text-center select-none"
            >
              <div class="p-3.5 rounded-full bg-[#ffffff]/10 backdrop-blur-md mb-2">
                <svg class="w-8 h-8 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <span class="text-sm font-bold uppercase tracking-wider text-[#dfdfdf]">No Image Available</span>
              <span class="text-xs text-[#888888] mt-0.5">San Francisco, Agusan del Sur</span>
            </div>
          </div>

          <!-- Photo Gallery Thumbnails (if multiple available) -->
          <div v-if="destination.photoUrls && destination.photoUrls.length > 1" class="flex items-center gap-3 overflow-x-auto p-2 bg-[#fafafa] dark:bg-[#1a1a1a] rounded-xl border border-[#e5e5e5] dark:border-[#282828]">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] shrink-0 px-2">Photos:</span>
            <button
              v-for="(photo, idx) in destination.photoUrls"
              :key="idx"
              type="button"
              class="w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0"
              :class="[
                activePhotoIndex === idx
                  ? 'border-[#85181a] dark:border-[#ef4444] scale-105 shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100'
              ]"
              @click="activePhotoIndex = idx"
            >
              <NuxtImg :src="photo" :alt="`Photo ${idx + 1}`" class="w-full h-full object-cover" format="webp" />
            </button>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-6">
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444] mb-2">
              Heritage & Background
            </h2>
            <h3 class="text-2xl md:text-3xl font-medium text-[#171717] dark:text-[#ffffff] tracking-tight">
              About this landmark
            </h3>
          </div>
          <p class="text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ displayDescription }}
          </p>
          <div class="pt-4 border-t border-[#ededed] dark:border-[#2e2e2e] flex flex-wrap items-center justify-between gap-4">
            <NuxtLink 
              to="/destinations" 
              class="inline-flex items-center gap-2 text-sm font-semibold text-[#85181a] dark:text-[#ef4444] hover:underline"
            >
              <MoveLeft :size="24" />
              Back to all destinations
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
    <section 
      v-if="destination.coordinates?.lat && destination.coordinates?.lng" 
      id="map-section"
      class="bg-gray-50 dark:bg-background relative z-30 flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-4"
    >
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-7xl mx-auto">
        <div>
          <div class="flex items-center gap-2 font-semibold">
            <Navigation :size="15" class="text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" />
            <span>Route from your GPS location to {{ destination.name }}</span>
          </div>
        </div>

        <!-- GPS Device Controls Toolbar -->
        <div class="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer select-none"
            :class="[
              isLiveTracking
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                : isLocating
                  ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                  : 'bg-[#85181a] hover:bg-[#6e1315] text-white dark:bg-[#ef4444] dark:hover:bg-[#dc2626] shadow-[#85181a]/20'
            ]"
            :disabled="isLocating"
            @click="isLiveTracking ? stopGpsTracking() : startGpsTracking()"
          >
            <div v-if="isLocating" class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <LocateFixed v-else-if="isLiveTracking" :size="15" class="animate-pulse" />
            <Locate v-else :size="15" />

            <span>
              {{ isLocating ? 'Acquiring GPS Signal…' : isLiveTracking ? 'GPS Tracking Active' : 'Track My Device GPS' }}
            </span>
          </button>
        
          <button
            v-if="userLocation"
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-md text-xs font-medium text-[#171717] dark:text-[#ffffff] bg-white dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer select-none"
            title="Center map on your current location"
            @click="centerOnUser"
          >
            <Locate :size="14" class="text-emerald-600 dark:text-emerald-400" />
            <span>Center on Me</span>
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto space-y-2">
        <!-- Active Route Info -->
        <div 
          v-if="userLocation && routeSummary" 
          class="flex flex-wrap items-center justify-between gap-3 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200"
        >
        
          <div class="flex items-center gap-4 font-medium">
            <span v-if="routeSummary.distance"><strong>Distance:</strong> {{ routeSummary.distance }}</span>
            <span v-if="routeSummary.duration"><strong>Est. Driving Time:</strong> {{ routeSummary.duration }}</span>
          </div>
        </div>

        <div 
          v-if="userLocation && locationSource && locationSource.type === 'network'"
          class="flex items-start gap-2 p-2.5  text-xs text-red-800 dark:text-blue-300"
        >
          <Globe :size="14" class="shrink-0" />
          <span>
            <strong>Using Network Positioning:</strong> Device location estimated via network IP, it may not be accurate.
          </span>
        </div>
        <div
          v-if="locationError && showLocationError"
          class="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs"
        >
          <div class="flex items-center gap-2">
            <AlertCircle :size="16" class="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{{ locationError }}</span>
          </div>
          <button
            type="button"
            class="text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white shrink-0 cursor-pointer p-1"
            @click="showLocationError = false"
          >
            <X :size="14" />
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto">
        <ClientOnly>
          <GoogleMap
            :center="mapCenter || destination.coordinates"
            :zoom="mapZoom"
            :markers="mapMarkers"
            :route-origin="userLocation"
            :route-destination="destination.coordinates"
            :route-origin-title="'Your Device GPS Location'"
            :route-destination-title="destination.name"
            height="420px"
            :show-street-view-btn="true"
            :show-route-summary="true"
            @route-calculated="handleRouteCalculated"
          />
          <template #fallback>
            <div class="w-full h-105 rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-gray-100 dark:bg-[#202020] flex items-center justify-center text-sm font-semibold text-gray-500 animate-pulse">
              Loading Google Maps…
            </div>
          </template>
        </ClientOnly>
      </div>
    </section>
    <Footer />
  </div>
</template>
