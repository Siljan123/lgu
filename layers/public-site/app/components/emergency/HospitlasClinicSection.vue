<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { 
  useEmergency, 
  type MedicalFacility, 
  calculateDistanceKm
} from '../../composables/useEmergency'
import FitlterBar from './FitlterBar.vue'
import EmergencyHotline from './EmergencyHotline.vue'
import HospitlasClinicCardView from './HospitlasClinicCardView.vue'
import HospitlasClinicTableView from './HospitlasClinicTableView.vue'
import GoogleMap from '../GoogleMap.vue'
import { 
  MapPin, 
  X, 
  Table, 
  LayoutGrid, 
  Locate, 
  LocateFixed, 
  AlertCircle, 
  HeartPulse,
  Compass,
  Navigation,
  Satellite,
  Wifi,
  Globe,
  Info
} from '@lucide/vue'

import {
  Pagination as UiPagination,
  PaginationContent as UiPaginationContent,
  PaginationItem as UiPaginationItem,
  PaginationNext as UiPaginationNext,
  PaginationPrevious as UiPaginationPrevious,
  PaginationEllipsis as UiPaginationEllipsis,
  PaginationFirst as UiPaginationFirst,
  PaginationLast as UiPaginationLast,
} from '@/../layers/base/app/components/ui/pagination'

const {
  facilitiesData,
  categories,
  categoryCounts,
  searchQuery,
  selectedCategory,
  selectedBarangay,
  viewMode,
  currentPage,
  itemsPerPage,
  activeFacilityId,
  selectedFacility,
  filteredFacilities,
  paginatedFacilities,
  mapMarkers,
  userLocation,
  locationSource,
  userHeading,
  userSpeed,
  isLocating,
  locationError,
  routeCalculationResult,
  selectCategory,
  selectBarangay,
  selectFacility,
  requestUserLocation,
} = useEmergency()

const mapCenter = ref({ lat: 8.5042, lng: 125.9786 })
const mapZoom = ref(15)
const mapViewContainerRef = ref<HTMLElement | null>(null)

const showLocationBanner = ref(true)

onMounted(() => {
  if (!selectedFacility.value && filteredFacilities.value.length > 0) {
    selectFacility(filteredFacilities.value[0]!)
    if (filteredFacilities.value[0]?.coordinates) {
      mapCenter.value = filteredFacilities.value[0].coordinates
    }
  }
})

watch(filteredFacilities, (newList) => {
  if (newList.length > 0 && (!selectedFacility.value || !newList.some(e => e.id === selectedFacility.value?.id))) {
    selectFacility(newList[0]!)
    if (newList[0]?.coordinates) {
      mapCenter.value = newList[0].coordinates
    }
  }
})

const onSelectFacility = (item: MedicalFacility, shouldScroll = true) => {
  selectFacility(item)
  if (item.coordinates) {
    mapCenter.value = item.coordinates
    mapZoom.value = 16
  }

  if (shouldScroll && mapViewContainerRef.value) {
    mapViewContainerRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleMarkerClick = (_marker: any, index: number) => {
  const markerConfig = mapMarkers.value[index]
  if (markerConfig?.isUserLocation) {
    if (userLocation.value) {
      mapCenter.value = userLocation.value
      mapZoom.value = 15
    }
    return
  }

  if (selectedFacility.value) {
    onSelectFacility(selectedFacility.value, false)
  }
}

const handleRouteCalculated = (result: any) => {
  routeCalculationResult.value = result
}

const onLocateMeClick = async () => {
  showLocationBanner.value = true
  try {
    const coords = await requestUserLocation({ enableHighAccuracy: true, watch: true })
    mapCenter.value = coords
    mapZoom.value = 15
  } catch {
  }
}

const centerOnUser = () => {
  if (userLocation.value) {
    mapCenter.value = userLocation.value
    mapZoom.value = 15
  }
}
</script>

<template>
  <section class="w-full py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] mt-1 max-w-3xl">
          Locate nearest hospitals, Rural Health Units (RHU), diagnostic laboratories, specialty clinics, and pharmacies in San Francisco, Agusan del Sur with GPS turn-by-turn route paths and navigation.
        </p>
      </div>
    </div>
    <div ref="mapViewContainerRef" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24">
      <div class="lg:col-span-6">
        <EmergencyHotline height="540px" />
      </div>
      <div class="lg:col-span-6 space-y-3">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5">
            <MapPin :size="15" class="text-red-600 dark:text-red-400" />
            Medical Map — {{ selectedCategory !== 'All' ? selectedCategory : 'All Medical Facilities' }}
          </h3>
        </div>

        <GoogleMap 
          :center="mapCenter"
          :zoom="mapZoom"
          :markers="mapMarkers"
          :route-origin="userLocation"
          :route-destination="selectedFacility?.coordinates || null"
          :route-origin-title="'Your Location'"
          :route-destination-title="selectedFacility ? `${selectedFacility.name} (${selectedFacility.address})` : 'Medical Facility Destination'"
          :show-route-summary="true"
          height="540px"
          center-address="San Francisco, Agusan del Sur, Philippines"
          @marker-click="handleMarkerClick"
          @route-calculated="handleRouteCalculated"
        />
      </div>
    </div>

    <!-- GPS Locator Toolbar -->
    <div class="space-y-3 mt-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            class="px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            :class="[
              userLocation 
                ? 'bg-[#10b981] text-[#ffffff] hover:bg-[#059669]' 
                : isLocating 
                  ? 'bg-red-500/20 text-red-600 dark:text-red-400' 
                  : 'bg-red-600 text-[#ffffff] hover:bg-red-700'
            ]"
            :disabled="isLocating"
            title="Detect your device GPS location and draw route line to chosen facility"
            @click="onLocateMeClick"
          >
            <div v-if="isLocating" class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <LocateFixed v-else-if="userLocation" :size="15" class="animate-pulse" />
            <Locate v-else :size="15" />

            <span>
              {{ isLocating ? 'Detecting GPS…' : userLocation ? 'GPS Tracking Active' : 'Use My Device GPS' }}
            </span>
          </button>

          <button
            v-if="userLocation"
            type="button"
            class="px-3 py-2 rounded-lg text-xs font-semibold text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#ffffff] bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dfdfdf] dark:border-[#2e2e2e] transition-colors cursor-pointer"
            title="Recenter map on your location"
            @click="centerOnUser"
          >
            <span>Center on Me</span>
          </button>

          <div
            v-if="userLocation && locationSource"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border"
            :class="[
              locationSource.type === 'satellite'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                : locationSource.type === 'wifi'
                  ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
                  : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
            ]"
            :title="locationSource.description"
          >
            <Satellite v-if="locationSource.type === 'satellite'" :size="13" />
            <Wifi v-else-if="locationSource.type === 'wifi'" :size="13" />
            <Globe v-else :size="13" />
            <span>{{ locationSource.shortLabel }}</span>
          </div>
        </div>
      </div>

      <!-- Laptop / Network Accuracy Info Note -->
      <div 
        v-if="userLocation && locationSource && locationSource.type === 'network'"
        class="flex items-start gap-2 p-2.5 rounded-md bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300"
      >
        <Info :size="15" class="shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
        <div>
          <span class="font-bold">Using ISP / Wi-Fi Network Positioning:</span>
          <span> Laptops lack dedicated satellite GPS hardware, so location is estimated via network gateways (approximate area). For pinpoint turn-by-turn satellite GPS navigation.</span>
        </div>
      </div>

      <div 
        v-if="locationError && showLocationBanner" 
        class="flex flex-row items-center justify-between gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs"
      >
        <div class="flex items-center gap-2">
          <AlertCircle :size="16" class="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{{ locationError }}</span>
        </div>
        <button 
          type="button" 
          class="text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white shrink-0 cursor-pointer"
          @click="showLocationBanner = false"
        >
          <X :size="14" />
        </button>
      </div>
    </div>

 
    <div class="pt-6 border-t border-[#dfdfdf] dark:border-[#2e2e2e] space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-lg font-bold text-[#171717] dark:text-[#ffffff] flex items-center gap-2">
            <LayoutGrid :size="20" class="text-red-600 dark:text-red-400" />
            Medical Facilities Directory
          </h3>
          <p class="text-xs text-[#707070] dark:text-[#a3a3a3]">
            Showing {{ filteredFacilities.length }} verified healthcare locations in San Francisco
          </p>
        </div>
        <!-- View Mode Switcher -->
        <div class="inline-flex items-center p-1 rounded-lg bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] self-start sm:self-auto">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            :class="[viewMode === 'grid' ? 'bg-[#171717] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#171717] shadow-2xs' : 'text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#ffffff]']"
            @click="viewMode = 'grid'"
          >
            <LayoutGrid :size="13" />
            <span>Cards View</span>
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            :class="[viewMode === 'table' ? 'bg-[#171717] text-[#ffffff] dark:bg-[#ffffff] dark:text-[#171717] shadow-2xs' : 'text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#ffffff]']"
            @click="viewMode = 'table'"
          >
            <Table :size="13" />
            <span>Table View</span>
          </button>
        </div>
      </div>

      <FitlterBar 
          :categories="categories"
          :selected-category="selectedCategory"
          :category-counts="categoryCounts"
          :selected-barangay="selectedBarangay"
          :search-query="searchQuery"
          :facilities="facilitiesData"
          :filtered-count="filteredFacilities.length"
          :total-count="facilitiesData.length"
          @update:selected-category="selectCategory"
          @update:selected-barangay="selectBarangay"
          @update:search-query="searchQuery = $event"
          @select-facility="onSelectFacility($event, true)"
      />

      <div 
        v-if="paginatedFacilities.length === 0" 
        class="flex flex-col items-center justify-center p-12 text-center bg-[#ffffff] dark:bg-[#202020] rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e]"
      >
        <div class="p-4 rounded-full bg-[#fafafa] dark:bg-[#1a1a1a] text-[#707070] dark:text-[#a3a3a3] mb-4">
          <HeartPulse :size="32" class="text-red-500" />
        </div>
        <h3 class="text-lg font-medium text-[#171717] dark:text-[#ffffff]">No medical facilities found</h3>
        <p class="mt-1 text-sm text-[#707070] dark:text-[#a3a3a3] max-w-sm">
          Try adjusting your search keywords or category filters to find the health service you need.
        </p>
      </div>
      
      <HospitlasClinicCardView 
        v-else-if="viewMode === 'grid'"
        :facilities="paginatedFacilities"
        :active-facility-id="activeFacilityId"
        :user-location="userLocation"
        @select-facility="onSelectFacility($event, true)"
      />

      <!-- Table View Component -->
      <HospitlasClinicTableView 
        v-else
        :facilities="paginatedFacilities"
        :total-count="filteredFacilities.length"
        :selected-category="selectedCategory"
        :active-facility-id="activeFacilityId"
        :user-location="userLocation"
        @select-facility="onSelectFacility($event, true)"
      />

      <div v-if="filteredFacilities.length > itemsPerPage" class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#dfdfdf] dark:border-[#2e2e2e]">
        <div class="text-xs text-[#707070] dark:text-[#a3a3a3]">
          Showing Page <strong class="text-[#171717] dark:text-[#ffffff]">{{ currentPage }}</strong> of {{ Math.ceil(filteredFacilities.length / itemsPerPage) }} ({{ filteredFacilities.length }} total places)
        </div>

        <UiPagination
          v-slot="{ page }"
          :items-per-page="itemsPerPage"
          :total="filteredFacilities.length"
          :sibling-count="1"
          :page="currentPage"
          @update:page="(p) => currentPage = p"
        >
          <UiPaginationContent v-slot="{ items }">
            <UiPaginationFirst />
            <UiPaginationPrevious />

            <template v-for="(item, index) in items">
              <UiPaginationItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                :is-active="item.value === page"
                class="cursor-pointer"
              >
                {{ item.value }}
              </UiPaginationItem>
              <UiPaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <UiPaginationNext />
            <UiPaginationLast />
          </UiPaginationContent>
        </UiPagination>
      </div>

    </div>

  </section>
</template>
