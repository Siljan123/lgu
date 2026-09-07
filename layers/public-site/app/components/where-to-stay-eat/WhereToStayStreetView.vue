<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, shallowRef } from 'vue'
import { type Establishment, calculateDistanceKm } from '../../composables/useWhereToStayEat'
import type { LocationSourceInfo } from '../../composables/useEmergency'
import { useGoogleMaps } from '../../composables/useGooglemaps'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  Navigation, 
  ExternalLink, 
  Route,
} from '@lucide/vue'

interface Props {
  establishment: Establishment | null
  userLocation?: { lat: number; lng: number } | null
  locationSource?: LocationSourceInfo | null
  routeDistance?: string | null
  routeDuration?: string | null
  isLiveTracking?: boolean
  isLocating?: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '620px',
  userLocation: null,
  locationSource: null,
  routeDistance: null,
  routeDuration: null,
  isLiveTracking: false,
  isLocating: false,
})

const emit = defineEmits<{
  (e: 'clear'): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const panorama = shallowRef<google.maps.StreetViewPanorama | null>(null)
const loading = ref(true)
const noPanoramaFound = ref(false)
const copiedState = ref(false)

// Live distance ticker — updates reactively as userLocation changes
const liveDistanceText = ref<string | null>(null)
let distanceUpdateTimer: ReturnType<typeof setInterval> | null = null

const { loadGoogleMaps, getNearestPanorama } = useGoogleMaps()

const directDistanceToUser = computed(() => {
  if (!props.userLocation || !props.establishment?.coordinates) return null
  return calculateDistanceKm(props.userLocation, props.establishment.coordinates)
})

// Displayed distance: prefer route distance (from Directions API), fall back to Haversine
const displayDistance = computed(() => {
  return props.routeDistance || directDistanceToUser.value?.distanceText || null
})

const displayDuration = computed(() => {
  return props.routeDuration || null
})

const directionsUrl = computed(() => {
  if (props.userLocation && props.establishment?.coordinates) {
    return `https://www.google.com/maps/dir/?api=1&origin=${props.userLocation.lat},${props.userLocation.lng}&destination=${props.establishment.coordinates.lat},${props.establishment.coordinates.lng}&travelmode=driving`
  }
  if (props.establishment) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.establishment.name + ' ' + (props.establishment.address || 'San Francisco Agusan del Sur'))}`
  }
  return 'https://www.google.com/maps'
})

// GPS source icon & label for the tracking badge
const trackingSourceLabel = computed(() => {
  if (props.isLocating) return 'Acquiring Signal…'
  if (!props.locationSource) return 'GPS'
  if (props.locationSource.type === 'satellite') return 'Satellite GPS'
  if (props.locationSource.type === 'wifi') return 'Wi-Fi'
  return 'IP Network'
})

const trackingBadgeColor = computed(() => {
  if (props.isLocating) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25'
  if (!props.locationSource) return 'bg-[#85181a]/10 text-[#85181a] dark:text-[#ef4444] border-[#85181a]/20'
  if (props.locationSource.type === 'satellite') return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
  return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25'
})

async function updateStreetViewPosition() {
  const targetCoords = props.establishment?.coordinates
  if (!targetCoords) return

  loading.value = true
  noPanoramaFound.value = false

  try {
    await loadGoogleMaps()
    if (!containerRef.value) return

    const nearestLoc = await getNearestPanorama(targetCoords, 3000)
    const finalPos = nearestLoc || targetCoords

    if (!panorama.value) {
      panorama.value = new google.maps.StreetViewPanorama(containerRef.value, {
        position: finalPos,
        pov: { heading: 160, pitch: 0 },
        zoom: 1,
        addressControl: true,
        zoomControl: true,
        fullscreenControl: true,
        motionTrackingControl: false
      })
    } else {
      panorama.value.setPosition(finalPos)
      panorama.value.setVisible(true)
    }

    if (!nearestLoc && !targetCoords) {
      noPanoramaFound.value = true
    }
  } catch (err) {
    console.error('Failed to update Street View panorama:', err)
    noPanoramaFound.value = true
  } finally {
    loading.value = false
  }
}

function copyPhone(phone?: string) {
  if (!phone) return
  navigator.clipboard.writeText(phone)
  copiedState.value = true
  setTimeout(() => {
    copiedState.value = false
  }, 2000)
}


onMounted(() => {
  updateStreetViewPosition()
})

onUnmounted(() => {
  if (distanceUpdateTimer) {
    clearInterval(distanceUpdateTimer)
    distanceUpdateTimer = null
  }
})
const {
  selectedEstablishment,
  filteredEstablishments,
  userLocation,
  locationSource,
  isLocating,
  locationError,
  isLiveTracking,
  selectEstablishment,
  requestUserLocation,
} = useWhereToStayEat()

const mapCenter = ref({ lat: 8.5042, lng: 125.9786 })
const mapZoom = ref(15)
const showLocationBanner = ref(true)

onMounted(() => {
  if (!selectedEstablishment.value && filteredEstablishments.value.length > 0) {
    selectEstablishment(filteredEstablishments.value[0]!)
    if (filteredEstablishments.value[0]?.coordinates) {
      mapCenter.value = filteredEstablishments.value[0].coordinates!
    }
  }

  // Auto-start GPS device tracking — no button needed
  if (!isLiveTracking.value && !userLocation.value) {
    requestUserLocation({ enableHighAccuracy: true, watch: true })
      .then((coords) => {
        mapCenter.value = coords
        mapZoom.value = 16
      })
      .catch(() => {
      })
  }
})

watch(filteredEstablishments, (newList) => {
  if (newList.length > 0 && (!selectedEstablishment.value || !newList.some(e => e.id === selectedEstablishment.value?.id))) {
    selectEstablishment(newList[0]!)
    if (newList[0]?.coordinates) {
      mapCenter.value = newList[0].coordinates!
    }
  }
})

const onLocateMeClick = async () => {
  showLocationBanner.value = true
  try {
    const coords = await requestUserLocation({ enableHighAccuracy: true, watch: true })
    mapCenter.value = coords
    mapZoom.value = 16
  } catch {
  }
}

const centerOnUser = () => {
  if (userLocation.value) {
    mapCenter.value = userLocation.value
    mapZoom.value = 17
  }
}

watch(() => props.establishment, () => {
  updateStreetViewPosition()
}, { deep: true })
</script>

<template>
  <div class="w-full overflow-hidden flex flex-col" >
     <div v-if="establishment" class="z-20 py-4 sm:py-5 space-y-3 text-[#171717] dark:text-[#ffffff]">
      <div class="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 class="text-lg font-extrabold text-[#171717] dark:text-[#ffffff] leading-snug">
            {{ establishment.name }}
          </h3>
          <div class="flex items-center gap-2 mt-1 text-xs text-[#64748b] dark:text-[#94a3b8]">
            <MapPin :size="13" class="text-[#85181a] dark:text-[#ef4444]" />
            <span>{{ establishment.address || 'San Francisco, Agusan del Sur' }}</span>
          </div>
        </div>

        <!-- Live distance badge — auto-updates as GPS position changes -->
        <div v-if="userLocation && displayDistance" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-300" :class="trackingBadgeColor">
          <Route :size="13" />
          <span>{{ displayDistance }} from your location</span>
          <span v-if="locationSource" class="text-[10px] font-semibold opacity-90">
            • {{ locationSource.type === 'satellite' ? 'Satellite GPS' : locationSource.type === 'wifi' ? 'Wi-Fi' : 'IP Network' }}
          </span>
          <span v-if="displayDuration" class="text-[11px] font-normal text-[#707070] dark:text-[#cbd5e1]">
            ({{ displayDuration }})
          </span>
          <!-- Live tracking pulse indicator -->
          <span v-if="isLiveTracking" class="relative flex h-2 w-2 ml-1" title="Auto-tracking active — distance updates in real-time">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="locationSource?.type === 'satellite' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
            <span class="relative inline-flex rounded-full h-2 w-2" :class="locationSource?.type === 'satellite' ? 'bg-emerald-600' : 'bg-amber-600'"></span>
          </span>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div v-if="establishment?.contactNo" class="flex items-center gap-2 text-xs font-bold text-[#1e293b] dark:text-[#f8fafc]">
          <Phone :size="14" class="text-[#85181a] dark:text-[#ef4444]" />
          <span>{{ establishment.contactNo }}</span>
          <button 
            type="button" 
            class="p-1 hover:bg-[#f1f5f9] dark:hover:bg-[#334155] text-[#64748b] transition-colors" 
            title="Copy phone"
            @click="copyPhone(establishment.contactNo)"
          >
            <Check v-if="copiedState" :size="13" class="text-green-600" />
            <Copy v-else :size="13" />
          </button>
        </div>
        <div v-else class="text-xs italic text-[#94a3b8]">
          {{ 'No contact number' }}
        </div>
      </div>
    </div>
   <div class="space-y-3 mt-8">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            class="px-4 py-2.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            :class="[
              userLocation 
                ? (locationSource?.type === 'satellite' ? 'bg-[#10b981] text-[#ffffff] hover:bg-[#059669]' : 'bg-amber-600 text-[#ffffff] hover:bg-amber-700')
                : isLocating 
                  ? 'bg-[#85181a]/20 text-[#85181a] dark:text-[#ef4444]' 
                  : 'bg-[#85181a] text-[#ffffff] hover:bg-[#a11e20] dark:bg-[#ef4444] dark:hover:bg-[#dc2626]'
            ]"
            :disabled="isLocating"
            title="Detect your device GPS location and draw route line to chosen destination"
            @click="onLocateMeClick"
          >
            <div v-if="isLocating" class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <Satellite v-else-if="userLocation && locationSource?.type === 'satellite'" :size="15" class="animate-pulse" />
            <Globe v-else-if="userLocation && locationSource?.type !== 'satellite'" :size="15" class="animate-pulse" />
            <LocateFixed v-else-if="userLocation" :size="15" class="animate-pulse" />
            <Locate v-else :size="15" />

            <span>
              <template v-if="isLocating">Detecting GPS…</template>
              <template v-else-if="userLocation">
                <span v-if="locationSource?.type === 'satellite'">Satellite GPS Active</span>
                <span v-else>IP Network Active</span>
              </template>
              <template v-else>Use My Device GPS</template>
            </span>
          </button>
          <button
            v-if="userLocation"
            type="button"
            class="px-3 py-2 rounded-sm text-xs font-semibold text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#ffffff] bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dfdfdf] dark:border-[#2e2e2e] transition-colors cursor-pointer"
            title="Recenter map on your location"
            @click="centerOnUser"
          >
            <span>Center on Me</span>
          </button>

          <!-- If Location Source Badge (Satellite vs IP Network) -->
          <div
            v-if="userLocation && locationSource"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-semibold border transition-all"
            :class="[
              locationSource.type === 'satellite'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
            ]"
            :title="locationSource.description"
          >
            <span v-if="locationSource.type === 'satellite'" class="inline-flex items-center gap-1.5">
              <Satellite :size="13" class="text-emerald-600 dark:text-emerald-400" />
              <span>Satellite GPS </span>
            </span>
            <span v-else class="inline-flex items-center gap-1.5">
              <Globe :size="13" class="text-amber-600 dark:text-amber-400" />
              <span>IP Network </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Info note: IP Network vs Satellite -->
      <div 
        v-if="userLocation && locationSource && locationSource.type !== 'satellite'"
        class="flex items-start gap-2 p-2.5 rounded-sm bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200"
      >
        <Info :size="15" class="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span class="font-bold">Using IP Network Positioning:</span>
          <span> Desktops and laptops lack dedicated satellite GPS hardware, so location is estimated via network gateways (approximate area). For pinpoint turn-by-turn satellite GPS navigation, open this site on a GPS-enabled mobile device.</span>
        </div>
      </div>

      <div 
        v-else-if="userLocation && locationSource && locationSource.type === 'satellite'"
        class="flex items-start gap-2 p-2.5 rounded-sm bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200"
      >
        <Satellite :size="15" class="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
        <div>
          <span class="font-bold">Satellite GPS Locked:</span>
          <span> Accurate street-level satellite positioning is active ({{ locationSource.accuracyRadiusText }} accuracy). Directions and distance calculations are calibrated to your exact device location.</span>
        </div>
      </div>

   
      <div 
        v-if="locationError && showLocationBanner" 
        class="flex flex-row items-center justify-between gap-3 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs"
      >
        <div class="flex items-center gap-2">
          <AlertCircle :size="16" class="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{{ locationError }}</span>
        </div>
        <button 
          type="button" 
          class="text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white shrink-0 cursor-pointer"
          @click="showLocationBanner = false"
        >
          <X :size="14" />
        </button>
      </div>
    </div>
  
  </div>
</template>
