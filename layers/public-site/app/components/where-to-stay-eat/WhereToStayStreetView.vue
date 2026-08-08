<script setup lang="ts">
import { ref, watch, onMounted, shallowRef } from 'vue'
import type { Establishment } from '../../composables/useWhereToStayEat'
import { useGoogleMaps } from '../../composables/useGooglemaps'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  Navigation, 
  ExternalLink, 
  Compass, 
  Info,
  Maximize2
} from '@lucide/vue'

interface Props {
  establishment: Establishment | null
  customLocation?: { lat: number; lng: number } | null
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '620px',
  customLocation: null
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

async function updateStreetViewPosition() {
  const targetCoords = props.customLocation || props.establishment?.coordinates
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

watch(() => [props.establishment, props.customLocation], () => {
  updateStreetViewPosition()
}, { deep: true })
</script>

<template>
  <div class="relative w-full rounded-xl overflow-hidden border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#171717] shadow-lg flex flex-col" :style="{ height }">
    
    <!-- Header Bar -->
    <div class="bg-[#1e293b] text-[#ffffff] px-4 py-3 flex items-center justify-between z-10 border-b border-[#334155]">
      <div class="flex items-center gap-2">
        <Compass :size="18" class="text-[#facc15] animate-pulse" />
        <span class="text-xs font-bold uppercase tracking-wider">
         Street View & Location View
        </span>
      </div>
      <span v-if="establishment" class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#334155] text-[#e2e8f0]">
        {{ establishment.category }}
      </span>
      <span v-else-if="customLocation" class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#85181a] text-[#ffffff]">
        Custom Map Location
      </span>
    </div>

    <!-- Panorama View Container -->
    <div class="relative flex-1 w-full bg-[#0f172a]">
      <div ref="containerRef" class="w-full h-full" />

      <!-- Loading State Overlay -->
      <div v-if="loading" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f172a]/90 text-[#ffffff] p-6 text-center space-y-3">
        <div class="w-8 h-8 border-3 border-[#85181a] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-medium text-[#94a3b8]">Loading Street View 360° panorama for marked location...</p>
      </div>

      <!-- Empty / Fallback State -->
      <div v-if="!establishment && !customLocation" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f172a] text-[#ffffff] p-8 text-center space-y-4">
        <div class="p-4 rounded-full bg-[#1e293b] text-[#94a3b8]">
          <Building2 :size="36" />
        </div>
        <div class="space-y-1 max-w-sm">
          <h4 class="text-base font-bold text-[#f8fafc]">Select or Click Map Location</h4>
          <p class="text-xs text-[#94a3b8]">
            Click anywhere on the map or select a pin to point the 360° Street View directly to that spot.
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom Floating Details Card (Overlaid at bottom of Street View) -->
    <div v-if="establishment || customLocation" class="z-20 bg-[#ffffff] dark:bg-[#1e293b] border-t border-[#dfdfdf] dark:border-[#334155] p-4 sm:p-5 space-y-3 text-[#171717] dark:text-[#ffffff]">
      
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-lg font-extrabold text-[#171717] dark:text-[#ffffff] leading-snug">
            {{ establishment ? establishment.name : 'Marked Map Location' }}
          </h3>
          <div class="flex items-center gap-2 mt-1 text-xs text-[#64748b] dark:text-[#94a3b8]">
            <MapPin :size="13" class="text-[#85181a] dark:text-[#ef4444]" />
            <span>{{ establishment ? establishment.address : 'San Francisco, Agusan del Sur' }}</span>
          </div>
        </div>
      </div>

      <!-- Contact & Action Buttons -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f1f5f9] dark:border-[#334155]">
        
        <!-- Phone number if available -->
        <div v-if="establishment?.contactNo" class="flex items-center gap-2 text-xs font-bold text-[#1e293b] dark:text-[#f8fafc]">
          <Phone :size="14" class="text-[#85181a] dark:text-[#ef4444]" />
          <span>{{ establishment.contactNo }}</span>
          <button 
            type="button" 
            class="p-1 rounded hover:bg-[#f1f5f9] dark:hover:bg-[#334155] text-[#64748b] transition-colors" 
            title="Copy phone"
            @click="copyPhone(establishment.contactNo)"
          >
            <Check v-if="copiedState" :size="13" class="text-green-600" />
            <Copy v-else :size="13" />
          </button>
        </div>
        <div v-else class="text-xs italic text-[#94a3b8]">
          {{ establishment ? 'No contact number recorded' : 'Click any establishment pin for contact details' }}
        </div>

        <!-- Directions CTA -->
        <div class="flex items-center gap-2">
          <a
            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((establishment?.name || 'San Francisco Agusan del Sur') + ' ' + (establishment?.address || ''))}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#ffffff] bg-[#85181a] hover:bg-[#a11e20] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] transition-all shadow-xs"
          >
            <Navigation :size="13" />
            <span>Open in Google Maps</span>
            <ExternalLink :size="12" />
          </a>
        </div>

      </div>

    </div>

  </div>
</template>
