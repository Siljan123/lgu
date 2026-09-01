<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BarangayItem } from '../../composables/useBarangayDirectory'
import GoogleMap from '../GoogleMap.vue'
import { Navigation } from '@lucide/vue'

const props = defineProps<{
  barangay: BarangayItem
}>()

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

</script>

<template>
  <Card>
    <CardContent>
      <div class="relative w-full h-56 md:h-64 rounded-lg overflow-hidden border border-[#dfdfdf] dark:border-[#333333] bg-neutral-100 dark:bg-neutral-900 group">
        <GoogleMap
          :center="mapCenter"
          :zoom="17"
          :markers="mapMarkers"
          height="100%"
          :show-street-view-btn="true"
        />
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
