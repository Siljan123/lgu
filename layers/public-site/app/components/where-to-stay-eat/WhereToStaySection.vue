<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useWhereToStayEat, type Establishment } from '../../composables/useWhereToStayEat'
import WhereToStayTags from './WhereToStayTags.vue'
import WhereToStayList from './WhereToStayList.vue'
import WhereToStayStreetView from './WhereToStayStreetView.vue'
import GoogleMap from '../GoogleMap.vue'
import { 
  MapPin, 
  Table,
  LayoutGrid,
} from '@lucide/vue'

const {
  categories,
  mainCategories,
  barangays,
  categoryCounts,
  mainCategoryCounts,
  searchQuery,
  selectedMainCategory,
  selectedSubCategory,
  selectedCategory,
  selectedBarangay,
  viewMode,
  currentPage,
  itemsPerPage,
  activeEstablishmentId,
  selectedEstablishment,
  filteredEstablishments,
  paginatedEstablishments,
  establishmentsData,
  mapMarkers,
  userLocation,
  locationAccuracy,
  locationSource,
  isLocating,
  locationError,
  isLiveTracking,
  travelMode,
  routeCalculationResult,
  selectMainCategory,
  selectSubCategory,
  selectCategory,
  selectBarangay,
  selectEstablishment,
  requestUserLocation,
  toggleLiveTracking,
  stopTracking,
} = useWhereToStayEat()

const mapCenter = ref({ lat: 8.5042, lng: 125.9786 })
const mapZoom = ref(15)
const mapViewContainerRef = ref<HTMLElement | null>(null)
const showLocationBanner = ref(true)

// Auto-select first establishment in category if none is selected
onMounted(() => {
  if (!selectedEstablishment.value && filteredEstablishments.value.length > 0) {
    selectEstablishment(filteredEstablishments.value[0]!)
    if (filteredEstablishments.value[0]?.coordinates) {
      mapCenter.value = filteredEstablishments.value[0].coordinates!
    }
  }

  // Auto-start GPS device tracking — no button needed
  if (!isLiveTracking.value && !userLocation.value) {
    requestUserLocation({ enableHighAccuracy: true, watch: true })
      .then((coords) => {
        mapCenter.value = coords
        mapZoom.value = 16
      })
      .catch(() => {
        // Permission denied or unavailable — silently ignore
      })
  }
})

watch(filteredEstablishments, (newList) => {
  if (newList.length > 0 && (!selectedEstablishment.value || !newList.some(e => e.id === selectedEstablishment.value?.id))) {
    selectEstablishment(newList[0]!)
    if (newList[0]?.coordinates) {
      mapCenter.value = newList[0].coordinates!
    }
  }
})

const onSelectEstablishment = (item: Establishment, shouldScroll = true) => {
  selectEstablishment(item)
  if (item.coordinates) {
    mapCenter.value = item.coordinates
    mapZoom.value = 16
  }

  // Smoothly scroll back to top Map & Street View container when Focus button is clicked
  if (shouldScroll && mapViewContainerRef.value) {
    mapViewContainerRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleMarkerClick = (marker: any, index: number) => {
  // Check if clicked marker is the user's location marker
  const markerConfig = mapMarkers.value[index]
  if (markerConfig?.isUserLocation) {
    if (userLocation.value) {
      mapCenter.value = userLocation.value
      mapZoom.value = 17
    }
    return
  }

  if (selectedEstablishment.value) {
    onSelectEstablishment(selectedEstablishment.value, false)
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
    mapZoom.value = 16
  } catch {
  }
}

const centerOnUser = () => {
  if (userLocation.value) {
    mapCenter.value = userLocation.value
    mapZoom.value = 17
  }
}

const startPointLabel = computed(() => {
  if (userLocation.value) {
    return locationSource.value?.type === 'satellite'
      ? 'Your Device Satellite GPS Location'
      : 'Your Device IP Network Location'
  }
  return 'Your Starting Location'
})

const activeDestinationCoords = computed(() => {
  return selectedEstablishment.value?.coordinates || null
})


</script>

<template>
  <section class="w-full py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-[#ffffff]">
          <span>Interactive Directory Map </span>
        </h2>
        <p class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] mt-1">
          Discover places to stay (Hotels, Inns, Homestays, Resorts) and places to eat (Restaurants, Eateries, Cafes, Local Food Stalls) across San Francisco, Agusan del Sur with GPS route line directions.
        </p>
      </div>
    </div>

    <div ref="mapViewContainerRef" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24">
      <div class="lg:col-span-6 space-y-3">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5">
            <MapPin :size="15" class="text-[#85181a] dark:text-[#ef4444]" />
            Location Map — {{ selectedCategory !== 'All' ? selectedCategory : 'Where to Stay & Eat' }}
          </h3>
        </div>

        <GoogleMap 
          :center="mapCenter"
          :zoom="mapZoom"
          :markers="mapMarkers"
          :route-origin="userLocation"
          :route-destination="activeDestinationCoords"
          :route-origin-title="startPointLabel"
          :route-destination-title="selectedEstablishment ? `${selectedEstablishment.name} (${selectedEstablishment.address})` : 'Destination'"
          :travel-mode="travelMode"
          :show-route-summary="true"
          height="540px"
          center-address="San Francisco, Agusan del Sur, Philippines"
          @marker-click="handleMarkerClick"
          @route-calculated="handleRouteCalculated"
        />
      </div>
      <div class="lg:col-span-6 lg:sticky lg:top-20 space-y-3">
        <WhereToStayStreetView 
          :establishment="selectedEstablishment"
          :user-location="userLocation"
          :location-source="locationSource"
          :route-distance="routeCalculationResult?.distanceText"
          :route-duration="routeCalculationResult?.durationText"
          :is-live-tracking="isLiveTracking"
          :is-locating="isLocating"
          height="580px"
        />
      </div>
    </div>
 
      <WhereToStayTags 
        :categories="categories"
        :main-categories="mainCategories"
        :selected-main-category="selectedMainCategory"
        :selected-sub-category="selectedSubCategory"
        :selected-category="selectedCategory"
        :category-counts="categoryCounts"
        :main-category-counts="mainCategoryCounts"
        :selected-barangay="selectedBarangay"
        :barangays="barangays"
        :search-query="searchQuery"
        :establishments="establishmentsData"
        :filtered-count="filteredEstablishments.length"
        :total-count="establishmentsData.length"
        @update:selected-main-category="selectMainCategory"
        @update:selected-sub-category="selectSubCategory"
        @update:selected-category="selectCategory"
        @update:selected-barangay="selectBarangay"
        @update:search-query="searchQuery = $event"
        @select-establishment="onSelectEstablishment($event, true)"
      />
    <div class="pt-6 border-t border-[#dfdfdf] dark:border-[#2e2e2e] space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-lg font-bold text-[#171717] dark:text-[#ffffff] flex items-center gap-2">
            <LayoutGrid :size="20" class="text-[#85181a] dark:text-[#ef4444]" />
            Establishments Showcase — {{ selectedCategory !== 'All' ? selectedCategory : 'Where to Stay & Eat' }}
          </h3>
        </div>

        <div class="inline-flex items-center p-1 rounded-sm bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] self-start sm:self-auto">
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
      <WhereToStayList 
        :establishments="paginatedEstablishments"
        :total-count="filteredEstablishments.length"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        :view-mode="viewMode"
        :active-id="activeEstablishmentId"
        :current-category="selectedCategory"
        :user-location="userLocation"
        :location-source="locationSource"
        @select="onSelectEstablishment($event, true)"
        @update:current-page="currentPage = $event"
      />
    </div>
  </section>
</template>
