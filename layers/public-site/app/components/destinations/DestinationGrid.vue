<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BadgeEuro, ChevronLeft, ChevronRight, MoveRight, Navigation } from '@lucide/vue'
import { useDestinations, type Destination, type LandmarkOption } from '../../composables/useDestinations'
import type { RouteCalculationResult } from '../../composables/useGooglemaps'
import DestinationCard from './DestinationCard.vue'
import DestinationRoutePlanner from './DestinationRoutePlanner.vue'
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

const {
  allLandmarkOptions,
  routeOriginLandmark,
  routeDestinationLandmark,
  routeTravelMode,
  setRouteOrigin,
  setRouteDestination,
  swapRoutePoints,
  clearRoute
} = useDestinations()

const currentMapCenter = ref({ lat: 8.5042, lng: 125.9786 })
const currentMapZoom = ref(12)
const activeRouteResult = ref<RouteCalculationResult | null>(null)
const selectedLandmark = ref<Destination | null>(null)

const mapOptions: google.maps.MapOptions = {
  clickableIcons: false,
  styles: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }]
    }
  ]
}

// Only display markers on the map for landmarks that have been chosen or clicked
const activeMapMarkers = computed(() => {
  const list: Array<{
    id: string
    name: string
    barangay: string
    category: string
    coordinates: { lat: number; lng: number }
    role?: 'start' | 'destination' | 'selected'
  }> = []

  const seenIds = new Set<string>()

  if (routeOriginLandmark.value?.coordinates) {
    seenIds.add(routeOriginLandmark.value.id)
    list.push({
      id: routeOriginLandmark.value.id,
      name: routeOriginLandmark.value.name,
      barangay: routeOriginLandmark.value.barangay,
      category: routeOriginLandmark.value.category,
      coordinates: routeOriginLandmark.value.coordinates,
      role: 'start'
    })
  }

  if (routeDestinationLandmark.value?.coordinates && !seenIds.has(routeDestinationLandmark.value.id)) {
    seenIds.add(routeDestinationLandmark.value.id)
    list.push({
      id: routeDestinationLandmark.value.id,
      name: routeDestinationLandmark.value.name,
      barangay: routeDestinationLandmark.value.barangay,
      category: routeDestinationLandmark.value.category,
      coordinates: routeDestinationLandmark.value.coordinates,
      role: 'destination'
    })
  }

  if (selectedLandmark.value?.coordinates && !seenIds.has(selectedLandmark.value.id)) {
    seenIds.add(selectedLandmark.value.id)
    list.push({
      id: selectedLandmark.value.id,
      name: selectedLandmark.value.name,
      barangay: selectedLandmark.value.barangay,
      category: selectedLandmark.value.category,
      coordinates: selectedLandmark.value.coordinates,
      role: 'selected'
    })
  }

  return list.map(item => {
    let titleBadge = ''
    if (item.role === 'start') titleBadge = ' (Starting Point)'
    else if (item.role === 'destination') titleBadge = ' (Destination)'

    return {
      position: item.coordinates,
      title: `${item.name} (${item.barangay})${titleBadge}`,
      infoWindowContent: `
        <div style="padding: 6px; max-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #85181a; margin-bottom: 2px;">
            ${item.role === 'start' ? '🏁 Starting Point' : item.role === 'destination' ? '🎯 Destination' : item.category}
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 3px 0; line-height: 1.3;">${item.name}</h4>
          <p style="font-size: 11px; color: #666; margin: 0 0 8px 0;">Brgy. ${item.barangay}</p>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button type="button" onclick="if(window.closeGoogleMapInfoWindow)window.closeGoogleMapInfoWindow()" style="display: inline-flex; align-items: center; justify-content: center; padding: 5px 10px; font-size: 11px; font-weight: 600; color: #ffffff; background-color: #85181a; border: none; border-radius: 6px; cursor: pointer;">
              Close
            </button>
            <a href="/destinations/${item.id}" style="display: inline-flex; align-items: center; justify-content: center; padding: 5px 10px; font-size: 11px; font-weight: 600; color: #171717; background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; text-decoration: none;">
              Details
            </a>
          </div>
        </div>
      `,
      onClick: () => {
        const dest = props.destinations.find(d => d.id === item.id)
        if (dest) {
          emit('select', dest)
        }
      }
    }
  })
})

watch(() => props.destinations, (list) => {
  if (selectedLandmark.value && !list.some(d => d.id === selectedLandmark.value?.id)) {
    selectedLandmark.value = null
  }
  if (list.length > 0 && list[0]?.coordinates && !selectedLandmark.value) {
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
  const item = activeMapMarkers.value[index]
  if (item?.position) {
    currentMapCenter.value = item.position
    currentMapZoom.value = 16
  }
}

// Center & zoom map when clicking landmark card in sidebar list, and place marker on map
const handleSidebarItemClick = (item: Destination) => {
  selectedLandmark.value = item
  if (item.coordinates) {
    currentMapCenter.value = item.coordinates
    currentMapZoom.value = 16
  }
}

function handleSetAsStart(item: Destination) {
  setRouteOrigin(item.id)
}

function handleSetAsDestination(item: Destination) {
  setRouteDestination(item.id)
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
      <div class="space-y-6">
        <!-- Interactive Route Planner Section -->
        <DestinationRoutePlanner
          :landmarks="allLandmarkOptions"
          :origin-landmark="routeOriginLandmark"
          :destination-landmark="routeDestinationLandmark"
          :travel-mode="routeTravelMode"
          :route-result="activeRouteResult"
          @update:origin="setRouteOrigin"
          @update:destination="setRouteDestination"
          @update:travel-mode="routeTravelMode = $event"
          @swap="swapRoutePoints"
          @clear="clearRoute"
        />

        <div v-if="destinations.length > 0" class="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div class="w-full lg:col-span-8 lg:sticky lg:top-24">
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <h3 class="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444]">
                  Landmark Map View & Line Path
                </h3>
                <div class="flex items-center gap-2">
                  <div
                    v-if="selectedLandmark"
                    class="text-[11px] md:text-xs text-[#171717] dark:text-[#ffffff] bg-[#f3f4f6] dark:bg-[#262626] px-2 py-0.5 rounded-md flex items-center gap-1.5 border border-[#e5e5e5] dark:border-[#333333]"
                  >
                    <span class="truncate max-w-45 sm:max-w-xs">Selected: <strong>{{ selectedLandmark.name }}</strong></span>
                    <button
                      type="button"
                      class="text-[#707070] hover:text-[#85181a] dark:hover:text-[#ef4444] font-bold ml-1 cursor-pointer"
                      title="Clear landmark marker from map"
                      @click="selectedLandmark = null"
                    >
                      ✕
                    </button>
                  </div>
                  <span v-else class="text-[11px] md:text-xs text-[#707070] dark:text-[#a3a3a3]">
                    Click a landmark in the list to place its marker
                  </span>
                </div>
              </div>
              
              <div class="w-full rounded-md overflow-hidden shadow-sm border border-[#e5e5e5] dark:border-[#282828]">
                <GoogleMap
                  :center="currentMapCenter"
                  :zoom="currentMapZoom"
                  :markers="activeMapMarkers"
                  :route-origin="routeOriginLandmark?.coordinates || null"
                  :route-destination="routeDestinationLandmark?.coordinates || null"
                  :travel-mode="routeTravelMode"
                  :map-options="mapOptions"
                  height="380px"
                  class="sm:h-115! lg:h-145! w-full"
                  :show-search="true"
                  search-placeholder="Search map location…"
                  @marker-click="handleMarkerClick"
                  @route-calculated="activeRouteResult = $event"
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
              class="p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer group shadow-xs space-y-2"
              :class="[
                selectedLandmark?.id === item.id
                  ? 'border-[#85181a] dark:border-[#ef4444] bg-[#85181a]/5 dark:bg-[#ef4444]/10 ring-2 ring-[#85181a]/20 dark:ring-[#ef4444]/20'
                  : 'border-[#e5e5e5] dark:border-[#282828] bg-[#ffffff] dark:bg-[#1a1a1a] hover:border-[#85181a] dark:hover:border-[#ef4444]'
              ]"
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
                  <div class="flex items-center justify-between gap-1">
                    <h4 class="text-xs sm:text-sm font-semibold text-[#171717] dark:text-[#ffffff] truncate group-hover:text-[#85181a] dark:group-hover:text-[#ef4444] transition-colors">
                      {{ item.name }}
                    </h4>
                    <span 
                      v-if="selectedLandmark?.id === item.id"
                      class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#85181a] text-[#ffffff] dark:bg-[#ef4444] shrink-0"
                    >
                      On Map
                    </span>
                  </div>
                  <p class="text-[11px] sm:text-xs text-[#707070] dark:text-[#a3a3a3] truncate mt-0.5">
                    Brgy. {{ item.barangay }}
                  </p>
                  <div class="mt-1.5 flex items-center justify-between text-[11px] font-medium ">
                    <button 
                      type="button" 
                      class="font-semibold hover:underline text-[#85181a] dark:text-[#ef4444]"
                      @click.stop="emit('select', item)"
                    >
                     <span class="flex space-x-2 gap-1"> View details <MoveRight :size="16"/></span>
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
      </div>
    </template>
  </div>
</template>



