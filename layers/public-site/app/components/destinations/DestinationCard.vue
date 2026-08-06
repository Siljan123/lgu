<script setup lang="ts">
import type { Destination } from '../../composables/useDestinations'

const props = defineProps<{
  destination: Destination
}>()

const emit = defineEmits<{
  (e: 'select', destination: Destination): void
}>()

const onCardClick = () => {
  emit('select', props.destination)
}
</script>

<template>
  <article 
    class="group relative flex flex-col h-full bg-[#ffffff] dark:bg-[#202020] rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#c7c7c7] dark:hover:border-[#404040]"
  >
    <!-- Image Header -->
    <div class="relative w-full aspect-16/10 overflow-hidden bg-[#fafafa] dark:bg-[#1a1a1a]">
      <NuxtImg 
        :src="destination.image" 
        :alt="destination.name"
        class="w-full h-full object-cover grayscale-[0.25] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
        loading="lazy"
        format="webp"
      />
      <!-- Category & Barangay Overlay Badges -->
      <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#171717]/80 dark:bg-[#000000]/80 text-[#ffffff] backdrop-blur-md border border-[#ffffff]/10 shadow-sm">
          {{ destination.category }}
        </span>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#ffffff]/90 dark:bg-[#1c1c1c]/90 text-[#171717] dark:text-[#ffffff] backdrop-blur-md shadow-sm border border-[#dfdfdf] dark:border-[#333333]">
          <svg class="w-3.5 h-3.5 text-[#85181a] dark:text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Brgy. {{ destination.barangay }}
        </span>
      </div>
    </div>

    <!-- Content Body -->
    <div class="flex flex-col flex-1 p-6 md:p-7">
      <h3 class="text-xl md:text-2xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff] group-hover:text-[#85181a] dark:group-hover:text-[#ef4444] transition-colors duration-200 line-clamp-2">
        {{ destination.name }}
      </h3>

      <p class="mt-3 text-sm md:text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed line-clamp-3 flex-1">
        {{ destination.shortDescription }}
      </p>

      <!-- Card Action Footer -->
      <div class="mt-6 pt-5 border-t border-[#ededed] dark:border-[#2e2e2e] flex items-center justify-between gap-4">
        <NuxtLink 
          :to="`/destinations/${destination.id}`" 
          class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#ffffff] transition-colors"
          @click.stop
        >
          <span>Dedicated Page</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </NuxtLink>

        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-md text-[#ffffff] bg-[#171717] hover:bg-[#85181a] dark:bg-[#ffffff] dark:text-[#171717] dark:hover:bg-[#ef4444] dark:hover:text-[#ffffff] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#85181a] focus:ring-offset-2"
          @click="onCardClick"
        >
          View Landmark
          <svg class="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>
