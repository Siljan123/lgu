<script setup lang="ts">
import type { Destination } from '../../composables/useDestinations'
import DestinationCard from './DestinationCard.vue'

defineProps<{
  destinations: Destination[]
}>()

const emit = defineEmits<{
  (e: 'select', destination: Destination): void
  (e: 'reset-filters'): void
}>()
</script>

<template>
  <div class="w-full">
    <!-- Grid of Cards -->
    <div 
      v-if="destinations.length > 0" 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-10"
    >
      <DestinationCard 
        v-for="item in destinations" 
        :key="item.id" 
        :destination="item"
        @select="emit('select', item)"
      />
    </div>

    <!-- Empty Filter Results State -->
    <div 
      v-else 
      class="py-16 text-center rounded-2xl border border-dashed border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1f1f1f] p-8"
    >
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#ededed] dark:bg-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3] mb-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-[#171717] dark:text-[#ffffff]">
        No destinations found
      </h3>
      <p class="mt-1 text-sm text-[#707070] dark:text-[#a3a3a3] max-w-sm mx-auto">
        We couldn't find any landmark matching your current search or category filter.
      </p>
      <button 
        type="button"
        class="mt-5 inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-[#171717] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#171717] hover:bg-[#85181a] dark:hover:bg-[#ef4444] dark:hover:text-[#ffffff] transition-colors"
        @click="emit('reset-filters')"
      >
        Clear all filters
      </button>
    </div>
  </div>
</template>
