<script setup lang="ts">
import { Sparkles, RotateCcw, Calendar, MapPin, ChevronRight, Award } from '@lucide/vue'
import type { EventFestival } from '../../composables/useEventsFestivals'
import EventCard from './EventCard.vue'

interface Props {
  events: EventFestival[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', event: EventFestival): void
  (e: 'resetFilters'): void
}>()
</script>

<template>
  <div class="w-full space-y-8">
    <!-- Grid View -->
    <div 
      v-if="events.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
    >
      <EventCard 
        v-for="event in events" 
        :key="event.id"
        :event="event"
        @select="emit('select', $event)"
      />
    </div>

    <!-- Empty State -->
    <div 
      v-else 
      class="w-full p-12 md:p-16 rounded-2xl border border-dashed border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1f1f1f] text-center flex flex-col items-center justify-center space-y-4"
    >
      <div class="w-12 h-12 rounded-full bg-[#ededed] dark:bg-[#2a2a2a] flex items-center justify-center text-[#707070] dark:text-[#a3a3a3]">
        <Calendar :size="24" />
      </div>
      
      <div class="space-y-1 max-w-md">
        <h4 class="text-lg font-medium text-[#171717] dark:text-[#ffffff]">
          No events found matching your criteria
        </h4>
        <p class="text-sm text-[#707070] dark:text-[#a3a3a3]">
          Try adjusting your search query or switching categories to view available municipal events and festivals.
        </p>
      </div>

      <button
        type="button"
        class="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-[#ffffff] bg-[#171717] hover:bg-[#85181a] dark:bg-[#ffffff] dark:text-[#171717] dark:hover:bg-[#ef4444] dark:hover:text-[#ffffff] transition-all cursor-pointer"
        @click="emit('resetFilters')"
      >
        <RotateCcw :size="14" />
        Reset All Filters
      </button>
    </div>
  </div>
</template>
