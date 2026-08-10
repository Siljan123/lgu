<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ArrowLeftRight, Navigation, MapPin, X, Car, Footprints, Bike, ChevronDown, ChevronUp, ExternalLink, Search, Tag, Building2, Landmark, Bus, Trees, Church } from '@lucide/vue'
import type { LandmarkOption } from '../../composables/useDestinations'
import type { RouteCalculationResult } from '../../composables/useGooglemaps'

interface Props {
  landmarks: LandmarkOption[]
  originLandmark?: LandmarkOption | null
  destinationLandmark?: LandmarkOption | null
  travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT'
  routeResult?: RouteCalculationResult | null
}

const props = withDefaults(defineProps<Props>(), {
  originLandmark: null,
  destinationLandmark: null,
  travelMode: 'DRIVING',
  routeResult: null,
})

const emit = defineEmits<{
  'update:origin': [landmark: LandmarkOption | null]
  'update:destination': [landmark: LandmarkOption | null]
  'update:travelMode': [mode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT']
  swap: []
  clear: []
}>()

const showSteps = ref(false)
const plannerContainerRef = ref<HTMLElement | null>(null)

const originSearch = ref('')
const destinationSearch = ref('')
const isOriginOpen = ref(false)
const isDestinationOpen = ref(false)
const activeTag = ref<'All' | 'bank' | 'terminal' | 'resort' | 'church' | 'civic'>('All')

// Keep search input synced with props
watch(() => props.originLandmark, (val) => {
  if (val) originSearch.value = val.name
  else originSearch.value = ''
}, { immediate: true })

watch(() => props.destinationLandmark, (val) => {
  if (val) destinationSearch.value = val.name
  else destinationSearch.value = ''
}, { immediate: true })

const categoryTags = [
  { id: 'All', label: 'All Landmarks', icon: Tag },
  { id: 'bank', label: 'Banks & ATMs', icon: Landmark },
  { id: 'resort', label: 'Day Resorts', icon: Trees },
  { id: 'church', label: 'Heritage & Churches', icon: Church },
  { id: 'civic', label: 'Civic Offices', icon: Building2 },
]

const filteredOriginLandmarks = computed(() => {
  const q = originSearch.value.toLowerCase().trim()
  return props.landmarks.filter(l => {
    const matchesTag = activeTag.value === 'All' || l.type === activeTag.value
    const matchesQuery = !q || l.name.toLowerCase().includes(q) || l.barangay.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)
    return matchesTag && matchesQuery
  }).slice(0, 12)
})

const filteredDestinationLandmarks = computed(() => {
  const q = destinationSearch.value.toLowerCase().trim()
  return props.landmarks.filter(l => {
    const matchesTag = activeTag.value === 'All' || l.type === activeTag.value
    const matchesQuery = !q || l.name.toLowerCase().includes(q) || l.barangay.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)
    return matchesTag && matchesQuery
  }).slice(0, 12)
})

function selectOrigin(landmark: LandmarkOption) {
  originSearch.value = landmark.name
  emit('update:origin', landmark)
  isOriginOpen.value = false
}

function selectDestination(landmark: LandmarkOption) {
  destinationSearch.value = landmark.name
  emit('update:destination', landmark)
  isDestinationOpen.value = false
}

function handleClearOrigin() {
  originSearch.value = ''
  emit('update:origin', null)
}

function handleClearDestination() {
  destinationSearch.value = ''
  emit('update:destination', null)
}

function setQuickPreset(originId: string, destId: string) {
  const originItem = props.landmarks.find(l => l.id === originId) || null
  const destItem = props.landmarks.find(l => l.id === destId) || null
  emit('update:origin', originItem)
  emit('update:destination', destItem)
}

function handleClickOutside(e: MouseEvent) {
  if (plannerContainerRef.value && !plannerContainerRef.value.contains(e.target as Node)) {
    isOriginOpen.value = false
    isDestinationOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

const googleMapsExternalUrl = computed(() => {
  if (!props.originLandmark?.coordinates || !props.destinationLandmark?.coordinates) return '#'
  const orig = `${props.originLandmark.coordinates.lat},${props.originLandmark.coordinates.lng}`
  const dest = `${props.destinationLandmark.coordinates.lat},${props.destinationLandmark.coordinates.lng}`
  return `https://www.google.com/maps/dir/?api=1&origin=${orig}&destination=${dest}`
})
</script>

<template>
  <div
    ref="plannerContainerRef"
    class="w-full bg-[#ffffff] dark:bg-[#1a1a1a] rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] p-4 sm:p-5 shadow-lg space-y-4 relative z-30"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-[#85181a] dark:text-[#ef4444] font-semibold text-xs uppercase tracking-wider">
        <Navigation class="w-4 h-4 shrink-0" />
        <span>Google Maps Route & Line Path</span>
      </div>
      <button
        v-if="originLandmark || destinationLandmark"
        type="button"
        @click="emit('clear'); originSearch = ''; destinationSearch = ''"
        class="inline-flex items-center gap-1 text-xs text-[#707070] hover:text-[#85181a] dark:text-[#a3a3a3] dark:hover:text-[#ef4444] transition-colors font-medium"
        title="Reset points"
      >
        <X class="w-3.5 h-3.5" />
        <span>Reset Route</span>
      </button>
    </div>

    <div class="space-y-2">
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span class="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] mr-1">Filter Search Tags:</span>
        <button
          v-for="tag in categoryTags"
          :key="tag.id"
          type="button"
          @click="activeTag = tag.id as any"
          class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-all"
          :class="[
            activeTag === tag.id
              ? 'border-[#85181a] bg-[#85181a] text-[#ffffff] dark:border-[#ef4444] dark:bg-[#ef4444] shadow-xs'
              : 'border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa] dark:bg-[#202020] text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#ffffff]'
          ]"
        >
          <component :is="tag.icon" class="w-3 h-3" />
          <span>{{ tag.label }}</span>
        </button>
      </div>

    </div>

    <!-- Searchable Origin & Destination Inputs -->
    <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start relative">
      
      <!-- Start Landmark (Origin Search) -->
      <div class="sm:col-span-5 space-y-1 relative">
            <label class=" text-[11px] font-semibold uppercase tracking-wider flex text-[#707070] dark:text-[#a3a3a3]">
           <MapPin :size="16" class="mr-1"  /> Starting Point   
        </label>
        <div class="relative">
          <input
            type="text"
            v-model="originSearch"
            placeholder="Search or pick starting landmark…"
            class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa] dark:bg-[#222222] text-xs font-medium text-[#171717] dark:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#85181a] dark:focus:ring-[#ef4444] transition-all"
            @focus="isOriginOpen = true; isDestinationOpen = false"
          />
         <Search :size="16" class="absolute left-3 z-10 top-3 "/>
          <button
            v-if="originSearch"
            type="button"
            @click="handleClearOrigin"
            class="absolute right-2.5 top-2.5 text-[#9a9a9a] hover:text-[#171717] dark:hover:text-[#ffffff]"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div
          v-if="isOriginOpen && filteredOriginLandmarks.length > 0"
          class="absolute top-full left-0 right-0 mt-1 bg-[#ffffff] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#303030] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-[#f0f0f0] dark:divide-[#2a2a2a]"
        >
          <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#888888] dark:text-[#777777] bg-[#fafafa] dark:bg-[#1a1a1a]">
            Select Origin Landmark ({{ filteredOriginLandmarks.length }})
          </div>
          <button
            v-for="l in filteredOriginLandmarks"
            :key="l.id"
            type="button"
            class="w-full text-left px-3.5 py-2 text-xs font-medium text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#282828] hover:text-[#85181a] dark:hover:text-[#ef4444] flex items-center justify-between transition-colors"
            @mousedown.prevent="selectOrigin(l)"
          >
            <div class="truncate">
              <div class="font-semibold">{{ l.name }}</div>
              <div class="text-[10px] text-[#707070] dark:text-[#a3a3a3]">Brgy. {{ l.barangay }}</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0 ml-2" :class="[l.type === 'bank' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-gray-500/10 text-gray-600 dark:text-gray-400']">
              {{ l.category }}
            </span>
          </button>
        </div>
      </div>

      <!-- Swap Button -->
      <div class="sm:col-span-2 flex items-center justify-center pt-2 sm:pt-6">
        <button
          type="button"
          @click="emit('swap')"
          class="p-2.5 rounded-xl border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa] hover:bg-[#85181a] hover:text-[#ffffff] dark:bg-[#222222] dark:hover:bg-[#ef4444] text-[#171717] dark:text-[#ffffff] transition-all shadow-xs"
          title="Swap start & destination"
        >
          <ArrowLeftRight class="w-4 h-4" />
        </button>
      </div>

      <div class="sm:col-span-5 space-y-1 relative">
        <label class=" text-[11px] font-semibold uppercase tracking-wider flex text-[#707070] dark:text-[#a3a3a3]">
           <MapPin :size="16" class="mr-1"  /> Destination Point Landmark  
        </label>
        <div class="relative">
       
          <input
            type="text"
            v-model="destinationSearch"
            placeholder="Search or pick destination landmark…"
            class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa] dark:bg-[#222222] text-xs font-medium text-[#171717] dark:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#85181a] dark:focus:ring-[#ef4444] transition-all"
            @focus="isDestinationOpen = true; isOriginOpen = false"
          />
         <Search class="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-2.5 top-3 pointer-events-none"/>
          <button
            v-if="destinationSearch"
            type="button"
            @click="handleClearDestination"
            class="absolute right-2.5 top-2.5 text-[#9a9a9a] hover:text-[#171717] dark:hover:text-[#ffffff]"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Filtered Destination Dropdown Menu -->
        <div
          v-if="isDestinationOpen && filteredDestinationLandmarks.length > 0"
          class="absolute top-full left-0 right-0 mt-1 bg-[#ffffff] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#303030] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-[#f0f0f0] dark:divide-[#2a2a2a]"
        >
          <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#888888] dark:text-[#777777] bg-[#fafafa] dark:bg-[#1a1a1a]">
            Select Destination Landmark ({{ filteredDestinationLandmarks.length }})
          </div>
          <button
            v-for="l in filteredDestinationLandmarks"
            :key="l.id"
            type="button"
            class="w-full text-left px-3.5 py-2 text-xs font-medium text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#282828] hover:text-[#85181a] dark:hover:text-[#ef4444] flex items-center justify-between transition-colors"
            @mousedown.prevent="selectDestination(l)"
          >
            <div class="truncate">
              <div class="font-semibold">{{ l.name }}</div>
              <div class="text-[10px] text-[#707070] dark:text-[#a3a3a3]">Brgy. {{ l.barangay }}</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0 ml-2" :class="[l.type === 'terminal' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gray-500/10 text-gray-600 dark:text-gray-400']">
              {{ l.category }}
            </span>
          </button>
        </div>
      </div>

    </div>

    <!-- Mode Selector & External Link -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
      <div v-if="originLandmark && destinationLandmark" class="flex items-center gap-2">
        <a
          :href="googleMapsExternalUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#dfdfdf] dark:border-[#333333] text-xs font-semibold text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#252525] transition-colors"
        >
          <span>Open Google Maps</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>

    <!-- Active Route Details Banner -->
    <div v-if="routeResult" class="p-3.5 rounded-xl bg-[#fafafa] dark:bg-[#222222] border border-[#dfdfdf] dark:border-[#333333] space-y-2">
      <div class="flex items-center justify-between">
        <div class="text-xs text-[#171717] dark:text-[#ffffff] font-medium">
          Line path active: <strong class="text-[#85181a] dark:text-[#ef4444]">{{ originLandmark?.name }}</strong> ➔ <strong class="text-emerald-600 dark:text-emerald-400">{{ destinationLandmark?.name }}</strong>
        </div>
        <button
          v-if="routeResult.steps && routeResult.steps.length > 0"
          type="button"
          @click="showSteps = !showSteps"
          class="inline-flex items-center gap-1 text-xs font-semibold text-[#85181a] dark:text-[#ef4444] hover:underline"
        >
          <span>{{ showSteps ? 'Hide steps' : 'View steps' }}</span>
          <ChevronUp v-if="showSteps" class="w-3.5 h-3.5" />
          <ChevronDown v-else class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Turn-by-Turn Steps Drawer -->
      <div v-if="showSteps && routeResult.steps.length > 0" class="pt-2 border-t border-[#dfdfdf] dark:border-[#303030] space-y-1.5 max-h-48 overflow-y-auto">
        <div
          v-for="(step, idx) in routeResult.steps"
          :key="idx"
          class="text-xs text-[#707070] dark:text-[#a3a3a3] flex items-start gap-2"
        >
          <span class="font-bold text-[#85181a] dark:text-[#ef4444] text-[10px] uppercase shrink-0 mt-0.5">{{ idx + 1 }}.</span>
          <div class="flex-1">
            <span>{{ step.instructions }}</span>
            <span v-if="step.distance" class="ml-1 text-[10px] font-semibold text-[#171717] dark:text-[#ffffff]">({{ step.distance }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
