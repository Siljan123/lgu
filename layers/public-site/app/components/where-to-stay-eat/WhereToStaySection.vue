<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useWhereToStayEat, type Establishment } from '../../composables/useWhereToStayEat'
import WhereToStayTags from './WhereToStayTags.vue'
import WhereToStayList from './WhereToStayList.vue'
import WhereToStayStreetView from './WhereToStayStreetView.vue'
import GoogleMap from '../GoogleMap.vue'
import { 
  MapPin, 
  X, 
  Table,
  LayoutGrid,
  Locate,
  LocateFixed,
  AlertCircle,
  Satellite,
  Globe,
  Info
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
  travelMode,
  routeCalculationResult,
  selectMainCategory,
  selectSubCategory,
  selectCategory,
  selectBarangay,
  selectEstablishment,
  requestUserLocation,
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
          <span>Interactive Directory Map & Street View </span>
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
          height="580px"
        />
      </div>
    </div>
    <div class="space-y-3 mt-8">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            class="px-4 py-2.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            :class="[
              userLocation 
                ? (locationSource?.type === 'satellite' ? 'bg-[#10b981] text-[#ffffff] hover:bg-[#059669]' : 'bg-amber-600 text-[#ffffff] hover:bg-amber-700')
                : isLocating 
                  ? 'bg-[#85181a]/20 text-[#85181a] dark:text-[#ef4444]' 
                  : 'bg-[#85181a] text-[#ffffff] hover:bg-[#a11e20] dark:bg-[#ef4444] dark:hover:bg-[#dc2626]'
            ]"
            :disabled="isLocating"
            title="Detect your device GPS location and draw route line to chosen destination"
            @click="onLocateMeClick"
          >
            <div v-if="isLocating" class="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <Satellite v-else-if="userLocation && locationSource?.type === 'satellite'" :size="15" class="animate-pulse" />
            <Globe v-else-if="userLocation && locationSource?.type !== 'satellite'" :size="15" class="animate-pulse" />
            <LocateFixed v-else-if="userLocation" :size="15" class="animate-pulse" />
            <Locate v-else :size="15" />

            <span>
              <template v-if="isLocating">Detecting GPS…</template>
              <template v-else-if="userLocation">
                <span v-if="locationSource?.type === 'satellite'">Satellite GPS Active</span>
                <span v-else>IP Network Active</span>
              </template>
              <template v-else>Use My Device GPS</template>
            </span>
          </button>
          <button
            v-if="userLocation"
            type="button"
            class="px-3 py-2 rounded-sm text-xs font-semibold text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#ffffff] bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dfdfdf] dark:border-[#2e2e2e] transition-colors cursor-pointer"
            title="Recenter map on your location"
            @click="centerOnUser"
          >
            <span>Center on Me</span>
          </button>

          <!-- If Location Source Badge (Satellite vs IP Network) -->
          <div
            v-if="userLocation && locationSource"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-semibold border transition-all"
            :class="[
              locationSource.type === 'satellite'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
            ]"
            :title="locationSource.description"
          >
            <span v-if="locationSource.type === 'satellite'" class="inline-flex items-center gap-1.5">
              <Satellite :size="13" class="text-emerald-600 dark:text-emerald-400" />
              <span>Satellite GPS </span>
            </span>
            <span v-else class="inline-flex items-center gap-1.5">
              <Globe :size="13" class="text-amber-600 dark:text-amber-400" />
              <span>IP Network </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Info note: IP Network vs Satellite -->
      <div 
        v-if="userLocation && locationSource && locationSource.type !== 'satellite'"
        class="flex items-start gap-2 p-2.5 rounded-sm bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200"
      >
        <Info :size="15" class="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <span class="font-bold">Using IP Network Positioning:</span>
          <span> Desktops and laptops lack dedicated satellite GPS hardware, so location is estimated via network gateways (approximate area). For pinpoint turn-by-turn satellite GPS navigation, open this site on a GPS-enabled mobile device.</span>
        </div>
      </div>

      <div 
        v-else-if="userLocation && locationSource && locationSource.type === 'satellite'"
        class="flex items-start gap-2 p-2.5 rounded-sm bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200"
      >
        <Satellite :size="15" class="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
        <div>
          <span class="font-bold">Satellite GPS Locked:</span>
          <span> Accurate street-level satellite positioning is active ({{ locationSource.accuracyRadiusText }} accuracy). Directions and distance calculations are calibrated to your exact device location.</span>
        </div>
      </div>

   
      <div 
        v-if="locationError && showLocationBanner" 
        class="flex flex-row items-center justify-between gap-3 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs"
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
