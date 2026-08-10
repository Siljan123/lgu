<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BarangayItem } from '../../composables/useBarangayDirectory'
import GoogleMap from '../GoogleMap.vue'
import { Navigation, Copy, Check, ExternalLink } from '@lucide/vue'

const props = defineProps<{
  barangay: BarangayItem
}>()

const isCopied = ref(false)

const googleMapsUrl = computed(() => {
  const { lat, lng } = props.barangay.coordinates
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
})

const mapCenter = computed(() => ({
  lat: props.barangay.coordinates.lat,
  lng: props.barangay.coordinates.lng
}))

const mapMarkers = computed(() => [
  {
    position: mapCenter.value,
    title: `${props.barangay.name} Barangay Hall`
  }
])

const copyCoordinates = async () => {
  try {
    await navigator.clipboard.writeText(props.barangay.coordinates.display)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch {
    // fallback if clipboard api unavailable
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <!-- Mini Map Header -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-[#171717] dark:text-[#ffffff]">
            Geographic Location & Interactive Map
          </h3>
          <span class="text-[11px] text-[#707070] dark:text-[#a3a3a3]">
            {{ barangay.name }} Coordinates & Location
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <button
            type="button"
            @click="copyCoordinates"
            class="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa] dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            :aria-label="isCopied ? 'Coordinates copied' : 'Copy coordinates'"
          >
            <Check v-if="isCopied" class="size-3.5 text-green-600 dark:text-green-400" />
            <Copy v-else class="size-3.5 text-[#707070]" />
            <span>{{ isCopied ? 'Copied' : 'Copy' }}</span>
          </button>

          <a
            :href="googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-colors"
          >
            <span>Google Map</span>
            <ExternalLink class="size-3" />
          </a>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div class="relative w-full h-56 md:h-64 rounded-lg overflow-hidden border border-[#dfdfdf] dark:border-[#333333] bg-neutral-100 dark:bg-neutral-900 group">
      
        <!-- Interactive Google Map (Zoomed into Barangay Hall) -->
        <GoogleMap
          :center="mapCenter"
          :zoom="17"
          :markers="mapMarkers"
          height="100%"
          :show-street-view-btn="true"
        />
        
        <!-- Floating Coordinate Overlay Pill -->
        <div class="absolute bottom-3 left-3 bg-[#ffffff]/90 dark:bg-[#1c1c1c]/90 text-[#171717] dark:text-[#ffffff] backdrop-blur-md px-3 py-1.5 rounded-md text-[11px] font-mono shadow-md flex items-center space-x-2 z-10 pointer-events-none">
          <Navigation class="size-3 text-[#f87171]" />
          <span>{{ barangay.coordinates.display }}</span>
        </div>

      </div>
    </CardContent>

    <CardFooter>
      <!-- Geographic Specs Footer -->
      <div class="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#707070] dark:text-[#a3a3a3] pt-1">
        <div class="p-2 rounded bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333]">
          <span class="block font-medium text-[#171717] dark:text-[#ffffff]">Latitude</span>
          <span class="font-mono text-[10px]">{{ barangay.coordinates.lat }}° N</span>
        </div>
        <div class="p-2 rounded bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333]">
          <span class="block font-medium text-[#171717] dark:text-[#ffffff]">Longitude</span>
          <span class="font-mono text-[10px]">{{ barangay.coordinates.lng }}° E</span>
        </div>
        <div class="p-2 rounded bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333]">
          <span class="block font-medium text-[#171717] dark:text-[#ffffff]">Elevation ASL</span>
          <span class="font-mono text-[10px]">{{ barangay.elevationASL }}</span>
        </div>
        <div class="p-2 rounded bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333]">
          <span class="block text-md">Population: {{ barangay.population.toLocaleString() }}</span>
          <span class="block font-medium text-[#171717] dark:text-[#ffffff]">Census Period</span>
          <span class="font-mono text-[10px] text-[#dc2626] font-semibold">{{ barangay.censusYear }}</span>
        </div>
      </div>
    </CardFooter>

  </Card>
</template>
