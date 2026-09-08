<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useWhereToStayEat, type Establishment } from '../../composables/useWhereToStayEat'
import WhereToStayTags from './WhereToStayTags.vue'
import WhereToStayList from './WhereToStayList.vue'
import WhereToStayStreetView from './WhereToStayStreetView.vue'
import GoogleMap from '../GoogleMap.vue'
import { 
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
  allEstablishmentMarkers,
  userLocation,
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
} = useWhereToStayEat()

const defaultSanFranciscoCenter = { lat: 8.5042, lng: 125.9786 }
const mapCenter = ref(userLocation.value || defaultSanFranciscoCenter)
const mapZoom = ref(userLocation.value ? 16 : 15)
const mapViewContainerRef = ref<HTMLElement | null>(null)
const showLocationBanner = ref(true)
const userHasSelected = ref(false)

// Center the map to the device or user location as default when available
watch(userLocation, (coords) => {
  if (coords && !userHasSelected.value && !selectedEstablishment.value) {
    mapCenter.value = coords
    mapZoom.value = 16
  }
}, { immediate: true })

// Show all markers initially; once user picks one, show only that marker + user location
const displayMarkers = computed(() => {
  if (userHasSelected.value) {
    return mapMarkers.value
  }
  // All filtered establishment markers + user location marker
  const markers = [...allEstablishmentMarkers.value]
  if (userLocation.value) {
    const sourceBadgeHtml = locationSource.value ? `
      <div style="display: inline-block; font-size: 10px; font-weight: 600; color: ${locationSource.value.color}; margin-bottom: 6px; background: rgba(0,0,0,0.04); padding: 2px 6px; border-radius: 4px;">
        ${locationSource.value.type === 'satellite' ? 'Satellite GPS' : 'IP Network'}
      </div>
    ` : ''
    markers.unshift({
      address: locationSource.value?.type === 'satellite' ? 'Your Device Satellite GPS Location' : 'Your Device IP Network Location',
      title: locationSource.value?.type === 'satellite' ? 'Starting Point (Satellite GPS)' : 'Starting Point (IP Network)',
      position: userLocation.value,
      isUserLocation: true,
      infoWindowContent: `
        <div style="padding: 8px 12px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="font-size: 10px; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 2px;">Starting Point</div>
          <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 2px 0;">Your Device GPS Location</h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">Lat: ${userLocation.value.lat.toFixed(5)}, Lng: ${userLocation.value.lng.toFixed(5)}</p>
          ${sourceBadgeHtml}
        </div>
      `
    })
  }
  return markers
})

onMounted(() => {
  // Center on device or user location if already acquired
  if (userLocation.value && !selectedEstablishment.value) {
    mapCenter.value = userLocation.value
    mapZoom.value = 16
  }

  // Auto-start GPS device tracking to center on user location as default
  if (!isLiveTracking.value) {
    requestUserLocation({ enableHighAccuracy: true, watch: true })
      .then((coords) => {
        // Keep map centered on user location when no establishment is selected
        if (!selectedEstablishment.value?.coordinates) {
          mapCenter.value = coords
          mapZoom.value = 16
        }
      })
      .catch(() => {
        // Fallback gracefully to default center if permission denied/unavailable
      })
  }
})

watch(filteredEstablishments, (newList) => {
  // Reset to show all markers when filters change
  userHasSelected.value = false
  if (selectedEstablishment.value && !newList.some(e => e.id === selectedEstablishment.value?.id)) {
    selectEstablishment(null)
  }
})

const onSelectEstablishment = (item: Establishment | null, shouldScroll = true) => {
  if (!item) {
    userHasSelected.value = false
    selectEstablishment(null)
    if (userLocation.value) {
      mapCenter.value = userLocation.value
      mapZoom.value = 16
    } else {
      mapCenter.value = defaultSanFranciscoCenter
      mapZoom.value = 15
    }
    return
  }
  userHasSelected.value = true
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
  const markerConfig = displayMarkers.value[index]
  if (!markerConfig) return

  // Clicked user location marker — just center on it
  if (markerConfig.isUserLocation) {
    if (userLocation.value) {
      mapCenter.value = userLocation.value
      mapZoom.value = 17
    }
    return
  }

  // In "all markers" mode, find the matching establishment by position and select it
  if (!userHasSelected.value) {
    const match = filteredEstablishments.value.find(
      e => e.coordinates?.lat === markerConfig.position.lat && e.coordinates?.lng === markerConfig.position.lng
    )
    if (match) {
      onSelectEstablishment(match, true)
      return
    }
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
        <p class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] mt-1">
          Discover places to stay (Hotels, Inns, Homestays, Resorts) and places to eat (Restaurants, Eateries, Cafes, Local Food Stalls) across San Francisco, Agusan del Sur with GPS route line directions.
        </p>
      </div>
    </div>

    <div ref="mapViewContainerRef" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24">
      <div class="lg:col-span-6 space-y-3">
        <GoogleMap 
          :center="mapCenter"
          :zoom="mapZoom"
          :markers="displayMarkers"
          :route-origin="userLocation"
          :route-destination="activeDestinationCoords"
          :route-origin-title="startPointLabel"
          :route-destination-title="selectedEstablishment ? `${selectedEstablishment.name} (${selectedEstablishment.address})` : 'Destination'"
          :travel-mode="travelMode"
          :show-route-summary="true"
          height="580px"
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
          :location-error="locationError"
          height="580px"
          @clear="onSelectEstablishment(null)"
          @locate="onLocateMeClick"
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
            Establishments Showcase
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
