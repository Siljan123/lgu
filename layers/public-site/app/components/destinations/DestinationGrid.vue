<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BadgeEuro, ChevronLeft, ChevronRight, MoveRight } from '@lucide/vue'
import type { Destination } from '../../composables/useDestinations'
import DestinationCard from './DestinationCard.vue'
import GoogleMap from '../GoogleMap.vue'

interface Props {
  destinations: Destination[]
  viewMode?: 'grid' | 'map'
  mapMarkers?: Array<{
    position: { lat: number; lng: number }
    title: string
    infoWindowContent?: string
    onClick?: () => void
  }>
  currentPage?: number
  totalPages?: number
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid',
  mapMarkers: () => [],
  currentPage: 1,
  totalPages: 1
})

const emit = defineEmits<{
  (e: 'select', destination: Destination): void
  (e: 'reset-filters'): void
  (e: 'page-change', page: number): void
}>()

const currentMapCenter = ref({ lat: 8.5042, lng: 125.9786 })
const currentMapZoom = ref(12)

watch(() => props.destinations, (list) => {
  if (list.length > 0 && list[0]?.coordinates) {
    currentMapCenter.value = list[0].coordinates
    currentMapZoom.value = 12
  }
}, { immediate: true })

const sidebarImageErrors = ref<Record<string, boolean>>({})

const handleImageError = (id: string) => {
  sidebarImageErrors.value[id] = true
}

// Smoothly zoom in to level 16 and center map when a marker is clicked
const handleMarkerClick = (_marker: any, index: number) => {
  const item = props.destinations[index]
  if (item?.coordinates) {
    currentMapCenter.value = item.coordinates
    currentMapZoom.value = 16
  }
}

// Center & zoom map when clicking landmark card in sidebar list
const handleSidebarItemClick = (item: Destination) => {
  if (item.coordinates) {
    currentMapCenter.value = item.coordinates
    currentMapZoom.value = 16
  }
}
</script>

<template>
  <div class="w-full space-y-8">

    <template v-if="viewMode === 'grid'">
      <div 
        v-if="destinations.length > 0" 
        class="space-y-10"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <DestinationCard 
            v-for="item in destinations" 
            :key="item.id" 
            :destination="item"
            @select="emit('select', item)"
          />
        </div>
        
        <div 
          v-if="totalPages > 1" 
          class="flex items-center justify-between pt-6 border-t border-[#e5e5e5] dark:border-[#282828]"
        >
          <div class="text-xs text-[#707070] dark:text-[#a3a3a3]">
            Page <strong class="text-[#171717] dark:text-[#ffffff]">{{ currentPage }}</strong> of {{ totalPages }}
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#dfdfdf] dark:border-[#303030] text-xs font-semibold bg-[#ffffff] dark:bg-[#202020] text-[#171717] dark:text-[#ffffff] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#fafafa] dark:hover:bg-[#282828] transition-all"
              :disabled="currentPage <= 1"
              @click="emit('page-change', currentPage - 1)"
            >
              <ChevronLeft :size="16" />
              <span>Previous</span>
            </button>

            <div class="hidden sm:flex items-center gap-1">
              <button
                v-for="p in totalPages"
                :key="p"
                type="button"
                class="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                :class="[
                  currentPage === p
                    ? 'bg-[#85181a] text-[#ffffff] dark:bg-[#ef4444] shadow-xs'
                    : 'bg-[#ffffff] dark:bg-[#202020] text-[#171717] dark:text-[#a3a3a3] border border-[#dfdfdf] dark:border-[#303030] hover:bg-[#fafafa] dark:hover:bg-[#282828]'
                ]"
                @click="emit('page-change', p)"
              >
                {{ p }}
              </button>
            </div>

            <button
              type="button"
              class="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#dfdfdf] dark:border-[#303030] text-xs font-semibold bg-[#ffffff] dark:bg-[#202020] text-[#171717] dark:text-[#ffffff] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#fafafa] dark:hover:bg-[#282828] transition-all"
              :disabled="currentPage >= totalPages"
              @click="emit('page-change', currentPage + 1)"
            >
              <span>Next</span>
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </div>

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
    </template>

    <template v-else>
      <div v-if="destinations.length > 0" class="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div class="w-full lg:col-span-8 lg:sticky lg:top-24">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444]">
                Landmark Map View
              </h3>
              <span class="text-[11px] md:text-xs text-[#707070] dark:text-[#a3a3a3]">
                Click markers to inspect details
              </span>
            </div>
            
            <div class="w-full rounded-2xl overflow-hidden shadow-lg border border-[#e5e5e5] dark:border-[#282828]">
              <GoogleMap
                :center="currentMapCenter"
                :zoom="currentMapZoom"
                :markers="mapMarkers"
                height="380px"
                class="sm:h-115! lg:h-145! w-full"
                :show-search="true"
                search-placeholder="Search map location…"
                @marker-click="handleMarkerClick"
              />
            </div>
          </div>
        </div>

        <div class="w-full lg:col-span-4 space-y-3 max-h-120 lg:max-h-155 overflow-y-auto pr-1">
          <div class="text-xs font-semibold uppercase tracking-wider text-[#888888] dark:text-[#777777] mb-2 hidden lg:block">
            Filtered Landmarks ({{ destinations.length }})
          </div>

          <div 
            v-for="item in destinations" 
            :key="item.id"
            class="p-3.5 sm:p-4 rounded-xl border border-[#e5e5e5] dark:border-[#282828] bg-[#ffffff] dark:bg-[#1a1a1a] hover:border-[#85181a] dark:hover:border-[#ef4444] transition-all cursor-pointer group shadow-xs"
            @click="handleSidebarItemClick(item)"
          >
            <div class="flex gap-3 items-center">
              <NuxtImg 
                v-if="!sidebarImageErrors[item.id] && item.image"
                :src="item.image" 
                :alt="item.name"
                class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                loading="lazy"
                format="webp"
                @error="handleImageError(item.id)"
              />
              <div 
                v-else 
                class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-linear-to-br from-[#2a2a2a] to-[#171717] shrink-0 flex flex-col items-center justify-center text-[#888888] p-1 text-center border border-[#333333] select-none"
              >
                <svg class="w-5 h-5 text-[#ef4444] mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-[8px] font-bold uppercase tracking-wider text-[#d4d4d4] leading-tight">No Image</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-xs sm:text-sm font-semibold text-[#171717] dark:text-[#ffffff] truncate group-hover:text-[#85181a] dark:group-hover:text-[#ef4444] transition-colors">
                  {{ item.name }}
                </h4>
                <p class="text-[11px] sm:text-xs text-[#707070] dark:text-[#a3a3a3] truncate mt-0.5">
                  Brgy. {{ item.barangay }}
                </p>
                <div class="mt-1.5 flex items-center justify-between text-[11px] font-medium ">
                  <Badge>Focus map</Badge>
                  <button 
                    type="button" 
                    class="font-semibold hover:underline"
                    @click.stop="emit('select', item)"
                  >
                   <span class="flex space-x-2 gap-1"> View details <MoveRight :size="20"/></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          No landmarks found on map
        </h3>
        <p class="mt-1 text-sm text-[#707070] dark:text-[#a3a3a3] max-w-sm mx-auto">
          Try clearing your search query or selecting another category.
        </p>
        <button 
          type="button"
          class="mt-5 inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-[#171717] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#171717] hover:bg-[#85181a] dark:hover:bg-[#ef4444] dark:hover:text-[#ffffff] transition-colors"
          @click="emit('reset-filters')"
        >
          Clear all filters
        </button>
      </div>
    </template>
  </div>
</template>


