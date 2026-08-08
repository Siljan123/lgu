<script setup lang="ts">
import { Calendar, MapPin, Sparkles, ChevronRight, Award, Flame, Mountain, Tag } from '@lucide/vue'
import type { Festival, EventItem } from '../../composables/useEventsFestivals'

const props = defineProps<{
  festival: Festival
  events: EventItem[]
}>()

const emit = defineEmits<{
  (e: 'select-event', event: EventItem): void
}>()
</script>

<template>
  <article class="rounded-2xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
    
    <!-- Festival Header & Identity Block -->
    <div class="grid grid-cols-1 lg:grid-cols-12 ">
      
      <!-- Festival Image -->
      <div class="lg:col-span-5 relative  overflow-hidden mr-4 bg-[#fafafa] dark:bg-[#1a1a1a]">
        <NuxtImg 
          :src="festival.image" 
          :alt="festival.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          format="webp"
        />
        <div class="absolute inset-0 bg-linear-to-t from-[#171717]/80 via-transparent to-transparent"></div>
        <div class="absolute bottom-4 left-4 right-4 text-[#ffffff]">
          <span class="text-xs font-mono tracking-wider flex items-center gap-1 text-[#dfdfdf]">
            <Calendar :size="13" class="text-[#ef4444]" /> {{ festival.whenHeld }}
          </span>
        </div>
      </div>
      <div class="lg:col-span-7 flex flex-col my-10  mx-4 justify-between space-y-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444]">
              Festival Identity & Heritage
            </span>
            <span class="text-[#9a9a9a]">•</span>
            <span class="text-xs text-[#707070] dark:text-[#a3a3a3]">
              {{ festival.whenHeld }}
            </span>
          </div>

          <h2 class="text-2xl md:text-3xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
            {{ festival.name }}
          </h2>
          
          <p class="text-sm font-medium text-[#85181a] dark:text-[#ef4444] mt-1">
            {{ festival.tagline }}
          </p>

          <p class="mt-3 text-sm md:text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ festival.shortDescription }}
          </p>
        </div>

        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-[#171717] dark:text-[#ffffff] mb-2">
            Recurring Highlights
          </h4>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="(h, idx) in festival.highlights" 
              :key="idx"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#fafafa] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#dfdfdf] border border-[#dfdfdf] dark:border-[#2e2e2e]"
            >
              {{ h.title }}
            </Badge>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-between border-t border-[#ededed] dark:border-[#2e2e2e]">
          <span class="text-xs text-[#707070] dark:text-[#a3a3a3]">
            Organized by {{ festival.organizer }}
          </span>

          <NuxtLink 
            :to="`/events-festivals/festivals/${festival.slug}`"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#ffffff] bg-[#85181a] hover:bg-[#6b1214] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] transition-colors"
          >
            <span>Explore Dedicated Festival Page</span>
            <ChevronRight :size="14" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>
