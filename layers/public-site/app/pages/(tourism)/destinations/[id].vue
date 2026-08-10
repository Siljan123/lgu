<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, X, MapPin, MoveLeft } from '@lucide/vue'
import { useDestinations, type LandmarkOption } from '../../../composables/useDestinations'
import GoogleMap from '../../../components/GoogleMap.vue'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const { getDestinationById, destinationsData, allLandmarkOptions } = useDestinations()

const destinationId = computed(() => route.params.id as string)
const destination = computed(() => getDestinationById(destinationId.value))

if (!destination.value) {
  showError({ statusCode: 404, statusMessage: 'Destination landmark not found' })
}

const activePhotoIndex = ref(0)
const hasImageError = ref(false)
const originLandmarkId = ref<string>('')
const pageSearchQuery = ref<string>('')
const isPageDropdownOpen = ref(false)
const sectionRef = ref<HTMLElement | null>(null)

watch(destinationId, () => {
  activePhotoIndex.value = 0
  hasImageError.value = false
  originLandmarkId.value = ''
  pageSearchQuery.value = ''
  isPageDropdownOpen.value = false
})

const originLandmark = computed(() => {
  if (!originLandmarkId.value) return null
  return allLandmarkOptions.find(l => l.id === originLandmarkId.value) || null
})

const filteredPageOrigins = computed(() => {
  const q = pageSearchQuery.value.toLowerCase().trim()
  return allLandmarkOptions.filter(l => {
    return !q || l.name.toLowerCase().includes(q) || l.barangay.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)
  }).slice(0, 10)
})

function selectPageOrigin(item: LandmarkOption) {
  originLandmarkId.value = item.id
  pageSearchQuery.value = item.name
  isPageDropdownOpen.value = false
}

function clearPageOrigin() {
  originLandmarkId.value = ''
  pageSearchQuery.value = ''
}

const currentImage = computed(() => {
  if (destination.value?.photoUrls && destination.value.photoUrls.length > activePhotoIndex.value) {
    return destination.value.photoUrls[activePhotoIndex.value]
  }
  return destination.value?.image || ''
})

const mapMarkers = computed(() => {
  if (destination.value?.coordinates?.lat && destination.value?.coordinates?.lng) {
    return [
      {
        position: destination.value.coordinates,
        title: destination.value.name
      }
    ]
  }
  return []
})

useHead({
  title: computed(() => `${destination.value?.name || 'Destination'} — San Francisco, Agusan del Sur`),
  meta: [
    {
      name: 'description',
      content: computed(() => destination.value?.shortDescription || 'San Francisco Agusan del Sur tourist destination.')
    }
  ]
})

function handleClickOutsideSection(e: MouseEvent) {
  if (sectionRef.value && !sectionRef.value.contains(e.target as Node)) {
    isPageDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutsideSection)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutsideSection)
})
</script>

<template>
  <div v-if="destination" class="bg-[#ffffff] dark:bg-[#141414] min-h-dvh flex flex-col">
    
    <!-- Top Banner / Hero -->
    <section class="relative w-full bg-[#141414] dark:bg-[#0d0d0d] border-b border-[#dfdfdf] dark:border-[#282828] pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div class="absolute inset-0 opacity-25 dark:opacity-35 pointer-events-none">
        <NuxtImg 
          :src="currentImage" 
          alt="Background overlay" 
          class="w-full h-full object-cover blur-lg scale-110"
        />
      </div>
      
      <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs font-medium text-[#b2b2b2] mb-6">
          <NuxtLink to="/" class="hover:text-[#ffffff] transition-colors">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/destinations" class="hover:text-[#ffffff] transition-colors">Destinations</NuxtLink>
          <span>/</span>
          <span class="text-[#ffffff] truncate max-w-50 sm:max-w-none">{{ destination.name }}</span>
        </nav>

        <div class="max-w-3xl space-y-4">
          <div class="flex flex-wrap items-center gap-2">
         
            <Badge class="px-3 py-1 rounded-full text-xs font-medium bg-[#ffffff]/20 text-[#ffffff] backdrop-blur-md border border-[#ffffff]/20">
              Brgy. {{ destination.barangay }}
            </Badge>
            <Badge v-if="destination.opening" class="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-400/20 flex items-center gap-1.5">
             
              {{ destination.opening }} - {{ destination.closing }}
            </Badge>
          </div>

          <h1 class="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#ffffff] leading-[1.15]">
            {{ destination.name }}
          </h1>

          <p class="text-base md:text-lg text-[#dfdfdf] leading-relaxed">
            {{ destination.shortDescription }}
          </p>
        </div>
      </div>
    </section>

    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left Photo Section & Gallery -->
        <div class="lg:col-span-7 space-y-4">
          <div class="rounded-2xl overflow-hidden border border-[#dfdfdf] dark:border-[#2e2e2e] shadow-xl bg-[#fafafa] dark:bg-[#202020] aspect-4/3 relative">
            <NuxtImg 
              v-if="!hasImageError && currentImage"
              :src="currentImage" 
              :alt="destination.name"
              class="w-full h-full object-cover transition-all duration-500"
              loading="eager"
              format="webp"
              @error="hasImageError = true"
            />
            <div 
              v-else 
              class="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-[#2a2a2a] via-[#1c1c1c] to-[#121212] text-[#a3a3a3] p-6 text-center select-none"
            >
              <div class="p-3.5 rounded-full bg-[#ffffff]/10 backdrop-blur-md mb-2">
                <svg class="w-8 h-8 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <span class="text-sm font-bold uppercase tracking-wider text-[#dfdfdf]">No Image Available</span>
              <span class="text-xs text-[#888888] mt-0.5">San Francisco, Agusan del Sur</span>
            </div>
          </div>

          <!-- Photo Gallery Thumbnails (if multiple available) -->
          <div v-if="destination.photoUrls && destination.photoUrls.length > 1" class="flex items-center gap-3 overflow-x-auto p-2 bg-[#fafafa] dark:bg-[#1a1a1a] rounded-xl border border-[#e5e5e5] dark:border-[#282828]">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] shrink-0 px-2">Photos:</span>
            <button
              v-for="(photo, idx) in destination.photoUrls"
              :key="idx"
              type="button"
              class="w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0"
              :class="[
                activePhotoIndex === idx
                  ? 'border-[#85181a] dark:border-[#ef4444] scale-105 shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100'
              ]"
              @click="activePhotoIndex = idx"
            >
              <NuxtImg :src="photo" :alt="`Photo ${idx + 1}`" class="w-full h-full object-cover" format="webp" />
            </button>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-6">
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444] mb-2">
              Heritage & Background
            </h2>
            <h3 class="text-2xl md:text-3xl font-medium text-[#171717] dark:text-[#ffffff] tracking-tight">
              About this landmark
            </h3>
          </div>
          <p class="text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ destination.fullDescription }}
          </p>
          <div class="pt-4 border-t border-[#ededed] dark:border-[#2e2e2e]">
            <NuxtLink 
              to="/destinations" 
              class="inline-flex items-center gap-2 text-sm font-semibold text-[#85181a] dark:text-[#ef4444] hover:underline"
            >
           <MoveLeft :size="24"/>
              Back to all destinations
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
      <!-- Google Map Pin & Route Line Path Widget -->
      <section ref="sectionRef" v-if="destination.coordinates?.lat && destination.coordinates?.lng" class="bg-gray-50 dark:bg-background relative z-30 flex-1 w-full mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-1">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto">
          <div>
            <h2 class="text-xl md:text-2xl font-medium text-[#171717] dark:text-[#ffffff]">
              Map Location & Interactive Route Line Path
            </h2>
            <p class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-0.5">
              Exact GPS: {{ destination.coordinates.lat.toFixed(6) }}, {{ destination.coordinates.lng.toFixed(6) }}
            </p>
          </div>

          <div class="relative min-w-65 sm:min-w-[320px]">
            <div class="relative">
              <input
                type="text"
                v-model="pageSearchQuery"
                placeholder="Going to? Search here..."
                class="w-full pl-9 pr-8 py-2 rounded-xl border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa] dark:bg-[#202020] text-xs font-medium text-[#171717] dark:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#85181a] dark:focus:ring-[#ef4444]"
                @focus="isPageDropdownOpen = true"
              />
              <Search class="w-4 h-4 text-[#85181a] dark:text-[#ef4444] absolute left-2.5 top-2.5 pointer-events-none" />
              <button
                v-if="pageSearchQuery"
                type="button"
                @click="clearPageOrigin"
                class="absolute right-2.5 top-2.5 text-[#9a9a9a] hover:text-[#171717] dark:hover:text-[#ffffff]"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div
              v-if="isPageDropdownOpen && filteredPageOrigins.length > 0"
              class="absolute top-full left-0 right-0 mt-1 bg-[#ffffff] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#303030] rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-[#f0f0f0] dark:divide-[#2a2a2a]"
            >
              <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#888888] dark:text-[#777777] bg-[#fafafa] dark:bg-[#1a1a1a]">
                Select Starting Point
              </div>
              <button
                v-for="l in filteredPageOrigins"
                :key="l.id"
                type="button"
                class="w-full text-left px-3.5 py-2 text-xs font-medium text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#282828] hover:text-[#85181a] dark:hover:text-[#ef4444] flex items-center justify-between transition-colors"
                @mousedown.prevent="selectPageOrigin(l)"
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
        </div>
        <div class=" max-w-7xl mx-auto">
          <GoogleMap
          :center="destination.coordinates"
          :zoom="15"
          :markers="mapMarkers"
          :route-origin="originLandmark?.coordinates || null"
          :route-destination="destination.coordinates"
          height="380px"
          :show-street-view-btn="true"
        />
        </div>
        
      </section>
    <Footer />
  </div>
</template>



