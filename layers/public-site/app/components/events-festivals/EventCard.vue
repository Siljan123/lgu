<script setup lang="ts">
import { Calendar, MapPin, Sparkles, ChevronRight, Award, Tag } from '@lucide/vue'
import type { EventFestival } from '../../composables/useEventsFestivals'

const props = defineProps<{
  event: EventFestival
}>()

const emit = defineEmits<{
  (e: 'select', event: EventFestival): void
}>()

const onCardClick = () => {
  emit('select', props.event)
}
</script>

<template>
  <article 
    class="group relative flex flex-col h-full bg-[#ffffff] dark:bg-[#202020] rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#c7c7c7] dark:hover:border-[#404040]"
  >
    <!-- Image Header -->
    <div class="relative w-full aspect-16/10 overflow-hidden bg-[#fafafa] dark:bg-[#1a1a1a]">
      <NuxtImg 
        :src="event.image" 
        :alt="event.name"
        class="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
        loading="lazy"
        format="webp"
      />

      <!-- Overlay Overlay Gradients -->
      <div class="absolute inset-0 bg-linear-to-t from-[#171717]/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

      <!-- Flagship Badge & Schedule Badge -->
      <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#ffffff]/90 dark:bg-[#1c1c1c]/90 text-[#171717] dark:text-[#ffffff] backdrop-blur-md shadow-sm border border-[#dfdfdf] dark:border-[#333333]">
          <Calendar :size="12" class="text-[#85181a] dark:text-[#ef4444]" />
          {{ event.peakDay ? `Peak ${event.peakDay}` : event.whenHeld }}
        </span>
      </div>

      <!-- Quick Title Overlay on Image Bottom -->
      <div class="absolute bottom-3 left-4 right-4 text-[#ffffff]">
        <span class="text-xs uppercase tracking-wider text-[#dfdfdf] font-mono flex items-center gap-1">
          <MapPin :size="12" /> {{ event.venue.split('—')[0] }}
        </span>
      </div>
    </div>

    <!-- Content Body -->
    <div class="flex flex-col flex-1 p-6 md:p-7">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444]">
          {{ event.category }}
        </span>
        <span class="text-[#9a9a9a]">•</span>
        <span class="text-xs text-[#707070] dark:text-[#a3a3a3]">
          {{ event.whenHeld }}
        </span>
      </div>

      <h3 class="text-xl md:text-2xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff] group-hover:text-[#85181a] dark:group-hover:text-[#ef4444] transition-colors duration-200 line-clamp-2">
        {{ event.name }}
      </h3>

      <p class="mt-3 text-sm md:text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed line-clamp-3 flex-1">
        {{ event.shortDescription }}
      </p>

      <!-- Highlights Preview Pills -->
      <div class="mt-5 flex flex-wrap gap-1.5">
        <span 
          v-for="(h, idx) in event.programHighlights.slice(0, 3)" 
          :key="idx"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#fafafa] dark:bg-[#1a1a1a] text-[#212121] dark:text-[#d4d4d4] border border-[#dfdfdf] dark:border-[#2e2e2e]"
        >
          {{ h.title }}
        </span>
        <span 
          v-if="event.programHighlights.length > 3"
          class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#ededed] dark:bg-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3]"
        >
          +{{ event.programHighlights.length - 3 }} more
        </span>
      </div>

      <!-- Card Action Footer -->
      <div class="mt-6 pt-5 border-t border-[#ededed] dark:border-[#2e2e2e] flex items-center justify-between gap-4">
        <div class="flex items-center gap-1 text-xs text-[#707070] dark:text-[#a3a3a3]">
          <MapPin :size="13" class="text-[#85181a] dark:text-[#ef4444]" />
          <span class="truncate max-w-[140px] md:max-w-[180px]">{{ event.venue }}</span>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-md text-[#ffffff] bg-[#171717] hover:bg-[#85181a] dark:bg-[#ffffff] dark:text-[#171717] dark:hover:bg-[#ef4444] dark:hover:text-[#ffffff] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#85181a] focus:ring-offset-2 shrink-0 cursor-pointer"
          @click="onCardClick"
        >
          <span>View Details</span>
          <ChevronRight :size="14" class="ml-1 transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  </article>
</template>
