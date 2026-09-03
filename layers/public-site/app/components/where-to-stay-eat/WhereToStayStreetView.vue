<script setup lang="ts">
import { ref, computed, watch, onMounted, shallowRef } from 'vue'
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
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '620px',
  userLocation: null,
  locationSource: null,
  routeDistance: null,
  routeDuration: null
})

const emit = defineEmits<{
  (e: 'clear'): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const panorama = shallowRef<google.maps.StreetViewPanorama | null>(null)
const loading = ref(true)
const noPanoramaFound = ref(false)
const copiedState = ref(false)

const { loadGoogleMaps, getNearestPanorama } = useGoogleMaps()

const directDistanceToUser = computed(() => {
  if (!props.userLocation || !props.establishment?.coordinates) return null
  return calculateDistanceKm(props.userLocation, props.establishment.coordinates)
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

watch(() => props.establishment, () => {
  updateStreetViewPosition()
}, { deep: true })
</script>

<template>
  <div class="w-full overflow-hidden flex flex-col" :style="{ height }">
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

        <div v-if="userLocation && (routeDistance || directDistanceToUser)" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#85181a]/10 dark:bg-[#ef4444]/20 text-[#85181a] dark:text-[#ef4444] text-xs font-bold border border-[#85181a]/20 dark:border-[#ef4444]/30">
          <Route :size="13" />
          <span>{{ routeDistance || directDistanceToUser?.distanceText }} from your location</span>
          <span v-if="locationSource" class="text-[10px] font-semibold opacity-90">
            • {{ locationSource.type === 'satellite' ? 'Satellite GPS' : 'IP Network' }}
          </span>
          <span v-if="routeDuration" class="text-[11px] font-normal text-[#707070] dark:text-[#cbd5e1]">
            ({{ routeDuration }})
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

        <!-- Directions CTA -->
        <div class="flex items-center gap-2">
          <a
            :href="directionsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#ffffff] bg-[#85181a] hover:bg-[#a11e20] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] transition-all shadow-xs"
          >
            <Navigation :size="13" />
            <span>{{ userLocation ? 'Navigate from My Location' : 'Open in Google Maps' }}</span>
            <ExternalLink :size="12" />
          </a>
        </div>

      </div>

    </div>

    <div class="bg-[#1e293b] text-[#ffffff] px-4 py-3 flex items-center justify-between z-10 border-b border-[#334155]">
      <span v-if="establishment" class="text-xs font-semibold px-2.5 py-0.5 rounded-sm bg-[#334155] text-[#e2e8f0]">
        {{ establishment.category }}
      </span>
    </div>
    <div class="relative flex-1 w-full bg-[#0f172a]">
      <div ref="containerRef" class="w-full h-full" />
      <div v-if="loading" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f172a]/90 text-[#ffffff] p-6 text-center space-y-3">
        <div class="w-8 h-8 border-3 border-[#85181a] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-medium text-[#94a3b8]">Loading Street View 360° panorama for destination...</p>
      </div>
      <div v-if="!establishment" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f172a] text-[#ffffff] p-8 text-center space-y-4">
        <div class="p-4 rounded-full bg-[#1e293b] text-[#94a3b8]">
          <Building2 :size="36" />
        </div>
        <div class="space-y-1 max-w-sm">
          <h4 class="text-base font-bold text-[#f8fafc]">Select an Establishment</h4>
          <p class="text-xs text-[#94a3b8]">
            Click any hotel, resort, restaurant, or cafe from the directory below to view its 360° Street View and navigation route.
          </p>
        </div>
      </div>
    </div>

   
  </div>
</template>
