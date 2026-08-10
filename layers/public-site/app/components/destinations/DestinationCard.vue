<script setup lang="ts">
import { ref } from 'vue'
import type { Destination } from '../../composables/useDestinations'
import { ChevronRight } from '@lucide/vue';

const props = defineProps<{
  destination: Destination
}>()

const emit = defineEmits<{
  (e: 'select', destination: Destination): void
}>()

const hasImageError = ref(false)

const onCardClick = () => {
  emit('select', props.destination)
}
</script>

<template>
  <article 
    class="group relative flex flex-col h-full bg-[#ffffff] dark:bg-[#1a1a1a] rounded-xl border border-[#e5e5e5] dark:border-[#282828] overflow-hidden transition-all duration-300 hover:shadow-lg"
  >
    <div class="relative w-full aspect-16/10 overflow-hidden bg-[#f4f4f4] dark:bg-[#121212]">
      <NuxtImg 
        v-if="!hasImageError && destination.image"
        :src="destination.image" 
        :alt="destination.name"
        class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        loading="lazy"
        format="webp"
        @error="hasImageError = true"
      />

      <div 
        v-else 
        class="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-[#2a2a2a] via-[#1f1f1f] to-[#141414] text-[#a3a3a3] p-4 text-center select-none group-hover:scale-105 transition-transform duration-500"
      >
        <div class="p-3 rounded-full bg-[#ffffff]/10 backdrop-blur-md mb-2">
          <svg class="w-6 h-6 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <span class="text-xs font-bold uppercase tracking-wider text-[#dfdfdf]">No Image Available</span>
        <span class="text-[10px] text-[#888888] mt-0.5 max-w-40 truncate">San Francisco, Agusan del Sur</span>
      </div>
      
      <div class="absolute inset-0 bg-lienar-to-t from-[#0d0d0d]/80 via-transparent to-[#0d0d0d]/20 opacity-80 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

      <div v-if="destination.opening" class="absolute bottom-3 left-3.5 z-10 pointer-events-none">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#0d0d0d]/80 text-[#d4d4d4] backdrop-blur-sm border border-[#ffffff]/10">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {{ destination.opening }} - {{ destination.closing }}
        </span>
      </div>
    </div>

    <div class="flex flex-col flex-1 p-6 md:p-7">
      <NuxtLink :to="`/destinations/${destination.id}`" class="group-hover:text-[#85181a] dark:group-hover:text-[#ef4444]">
        <h3 class="text-xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff] transition-colors duration-200 line-clamp-2">
          {{ destination.name }}
        </h3>
      </NuxtLink>

      <p class="mt-3 text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed line-clamp-3 flex-1">
        {{ destination.shortDescription }}
      </p>

      <div class="mt-4 flex flex-wrap gap-1.5">
      </div>

      <div class="mt-6 pt-5 border-t border-[#f0f0f0] dark:border-[#262626] flex items-center justify-between gap-4">
        <NuxtLink
          :to="`/destinations/${destination.id}`"
          class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg text-[#ffffff] bg-[#171717] hover:bg-[#85181a] dark:bg-[#ffffff] dark:text-[#171717] dark:hover:bg-[#ef4444] dark:hover:text-[#ffffff] active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#85181a] focus:ring-offset-2"
          @click="onCardClick"
        >
          View Landmark
         <ChevronRight :size="20"/>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>


