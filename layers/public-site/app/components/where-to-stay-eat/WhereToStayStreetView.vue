<script setup lang="ts">
import { ref, computed } from 'vue'
import { type Establishment, calculateDistanceKm } from '../../composables/useWhereToStayEat'
import type { LocationSourceInfo } from '../../composables/useEmergency'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  Navigation, 
  ExternalLink, 
  Route,
  Compass,
  Clock,
  Satellite,
  Globe,
  LocateFixed,
  Locate,
  Info,
  AlertCircle,
  X
} from '@lucide/vue'

interface Props {
  establishment: Establishment | null
  userLocation?: { lat: number; lng: number } | null
  locationSource?: LocationSourceInfo | null
  routeDistance?: string | null
  routeDuration?: string | null
  isLiveTracking?: boolean
  isLocating?: boolean
  locationError?: string | null
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '580px',
  userLocation: null,
  locationSource: null,
  routeDistance: null,
  routeDuration: null,
  isLiveTracking: false,
  isLocating: false,
  locationError: null,
})

const emit = defineEmits<{
  (e: 'clear'): void
  (e: 'locate'): void
}>()

const copiedState = ref(false)
const showLocationBanner = ref(true)
const imageFailed = ref(false)

const directDistanceToUser = computed(() => {
  if (!props.userLocation || !props.establishment?.coordinates) return null
  return calculateDistanceKm(props.userLocation, props.establishment.coordinates)
})

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

const trackingBadgeColor = computed(() => {
  if (props.isLocating) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25'
  if (!props.locationSource) return 'bg-[#85181a]/10 text-[#85181a] dark:text-[#ef4444] border-[#85181a]/20'
  if (props.locationSource.type === 'satellite') return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
  return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25'
})

function copyPhone(phone?: string) {
  if (!phone) return
  navigator.clipboard.writeText(phone)
  copiedState.value = true
  setTimeout(() => {
    copiedState.value = false
  }, 2000)
}

function onLocateMeClick() {
  showLocationBanner.value = true
  emit('locate')
}
</script>

<template>
  <div 
    class="relative w-full rounded-md overflow-hidden border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#1a1a1a] shadow-xs flex flex-col justify-between"
    :style="{ minHeight: height }"
  >
    <div class="bg-[#1e293b] text-[#ffffff] px-4 py-3 flex items-center justify-between z-10 border-b border-[#334155]">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider">
          Establishment Details
        </span>
      </div>
      <div v-if="establishment" class="flex items-center gap-2">
        <button
          type="button"
          class="p-1 rounded hover:bg-white/10 text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          title="Clear selection"
          @click="emit('clear')"
        >
          <X :size="14" />
        </button>
      </div>
    </div>

    <div v-if="establishment" class="flex-1 flex flex-col">
      <!-- Optional Establishment Photo -->
      <div 
        v-if="establishment.image && !imageFailed" 
        class="relative w-full h-44 sm:h-52 bg-[#0f172a] overflow-hidden border-b border-[#dfdfdf] dark:border-[#2e2e2e]"
      >
        <img 
          :src="establishment.image" 
          :alt="establishment.name" 
          class="w-full h-full object-cover" 
          @error="imageFailed = true" 
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      <!-- Details Content -->
      <div class="p-4 sm:p-5 space-y-4 flex-1">
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 class="text-lg sm:text-xl font-extrabold text-[#171717] dark:text-[#ffffff] leading-snug">
              {{ establishment.name }}
            </h3>
            <div class="flex items-start gap-1.5 mt-1.5 text-xs text-[#64748b] dark:text-[#94a3b8]">
              <MapPin :size="14" class="text-[#85181a] dark:text-[#ef4444] shrink-0 mt-0.5" />
              <span>{{ establishment.address || 'San Francisco, Agusan del Sur' }}</span>
            </div>
          </div>
          <div 
            v-if="userLocation && displayDistance" 
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-300 self-start" 
            :class="trackingBadgeColor"
          >
            <Route :size="13" />
            <span>{{ displayDistance }} from your location</span>
            <span v-if="isLiveTracking" class="relative flex h-2 w-2 ml-1" title="Live tracking active">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="locationSource?.type === 'satellite' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" :class="locationSource?.type === 'satellite' ? 'bg-emerald-600' : 'bg-amber-600'"></span>
            </span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f1f5f9] dark:border-[#2e2e2e]">
          <div v-if="establishment.contactNo" class="flex items-center gap-2 text-xs font-bold text-[#1e293b] dark:text-[#f8fafc]">
            <Phone :size="14" class="text-[#85181a] dark:text-[#ef4444]" />
            <span>{{ establishment.contactNo }}</span>
            <button 
              type="button" 
              class="p-1 hover:bg-[#f1f5f9] dark:hover:bg-[#334155] text-[#64748b] transition-colors rounded cursor-pointer" 
              title="Copy phone"
              @click="copyPhone(establishment.contactNo)"
            >
              <Check v-if="copiedState" :size="13" class="text-green-600" />
              <Copy v-else :size="13" />
            </button>
          </div>
          <div class="text-xs italic text-[#94a3b8]">
            No contact number recorded
          </div>

          <div class="flex items-center gap-2">
            <a
              :href="directionsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-[#ffffff] bg-[#85181a] hover:bg-[#a11e20] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] transition-all shadow-xs"
            >
              <Navigation :size="14" />
              <span v-if="userLocation">Official Google Map</span>
              <span v-else>Open in Google Maps</span>
              <ExternalLink :size="12" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
      <div class="w-16 h-16 rounded-full bg-[#85181a]/10 dark:bg-[#ef4444]/15 border border-[#85181a]/20 dark:border-[#ef4444]/30 flex items-center justify-center text-[#85181a] dark:text-[#ef4444] mb-4 shadow-xs">
        <Building2 :size="32" />
      </div>
      <h3 class="text-base sm:text-lg font-bold text-[#171717] dark:text-[#ffffff]">
        Select an Establishment
      </h3>
      <p class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] max-w-sm mt-1.5 leading-relaxed">
        Click any accommodation or dining spot from the interactive map pins or directory list below.
      </p>
    </div>

    <div class="p-4 sm:p-5 pt-3 border-t border-[#dfdfdf] dark:border-[#2e2e2e] space-y-3 bg-[#fafafa] dark:bg-[#171717]/60">
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
            title="Detect your device GPS location and center map on you"
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
        </div>
      </div>

      <div 
        v-if="userLocation && locationSource && locationSource.type !== 'satellite'"
        class="flex items-start gap-2 p-2.5 rounded-sm bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200"
      >
        <Info :size="15" class="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span class="font-bold">Using IP Network Positioning:</span>
          <span> Location is estimated via network gateways.</span>
        </div>
      </div>

      <div 
        v-else-if="userLocation && locationSource && locationSource.type === 'satellite'"
        class="flex items-start gap-2 p-2.5 rounded-sm bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200"
      >
        <Satellite :size="15" class="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
        <div>
          <span class="font-bold">Using Satelite Positioning:</span>
          <span> Accurate street-level satellite positioning is active. Directions and distance calculations are calibrated to your exact device location.</span>
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
