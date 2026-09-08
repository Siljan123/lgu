<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useWhereToStayEat, type Establishment } from '../../composables/useWhereToStayEat'
import type { MarkerConfig } from '../../composables/useGooglemaps'
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
  userLocation,
  locationSource,
  isLocating,
  locationError,
  isLiveTracking,
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

// Standard SVG teardrop pin path
const PIN_SVG_PATH = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'

// Center the map to the device or user location as default when available
watch(userLocation, (coords) => {
  if (coords && !selectedEstablishment.value) {
    mapCenter.value = coords
    mapZoom.value = 16
  }
}, { immediate: true })

// Display all filtered establishment markers; prominently highlight the selected one
const displayMarkers = computed<MarkerConfig[]>(() => {
  const isGoogleAvailable = typeof google !== 'undefined' && Boolean(google.maps)
  const activeId = selectedEstablishment.value?.id

  return filteredEstablishments.value
    .filter(item => item.coordinates)
    .map(item => {
      const isSelected = activeId === item.id

      let icon: any = undefined
      if (isGoogleAvailable) {
        if (isSelected) {
          icon = {
            path: PIN_SVG_PATH,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2.5,
            scale: 2.2,
            anchor: new google.maps.Point(12, 22),
          }
        } else {
          icon = {
            path: PIN_SVG_PATH,
            fillColor: item.mainCategory === 'Where to Stay' ? '#85181a' : '#c2410c',
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
            scale: 1.4,
            anchor: new google.maps.Point(12, 22),
          }
        }
      }

      return {
        id: item.id,
        address: item.address,
        title: `${item.name} — ${item.address}`,
        position: { lat: item.coordinates.lat, lng: item.coordinates.lng },
        isUserLocation: false,
        zIndex: isSelected ? 9999 : 10,
        icon,
        infoWindowContent: `
          <div style="padding: 8px 12px; max-width: 240px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #85181a; margin-bottom: 2px;">${item.subCategory || item.category}</div>
            <h4 style="font-size: 13px; font-weight: 700; color: #171717; margin: 0 0 3px 0; line-height: 1.3;">${item.name}</h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">${item.address}</p>
            ${item.contactNo ? `<div style="font-size: 11px; color: #1e293b; font-weight: 600; margin-top: 4px;">${item.contactNo}</div>` : ''}
            ${item.operatingHours ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">${item.operatingHours}</div>` : ''}
            <div style="margin-top: 8px; display: flex; gap: 6px;">
              <button type="button" onclick="if(window.closeGoogleMapInfoWindow)window.closeGoogleMapInfoWindow()" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 8px; font-size: 10px; font-weight: 600; color: #ffffff; background-color: #85181a; border: none; border-radius: 4px; cursor: pointer;">
                Close
              </button>
            </div>
          </div>
        `
      }
    })
})

const selectedMarkerIndex = computed(() => {
  if (!selectedEstablishment.value) return -1
  return displayMarkers.value.findIndex(m => m.id === selectedEstablishment.value?.id)
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
  if (selectedEstablishment.value && !newList.some(e => e.id === selectedEstablishment.value?.id)) {
    selectEstablishment(null)
  }
})

const onSelectEstablishment = (item: Establishment | null, shouldScroll = true) => {
  if (!item) {
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
  selectEstablishment(item)
  if (item.coordinates) {
    mapCenter.value = item.coordinates
    mapZoom.value = 17
  }

  // Smoothly scroll back to top Map & Street View container when clicked
  if (shouldScroll && mapViewContainerRef.value) {
    mapViewContainerRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleMarkerClick = (marker: any, index: number) => {
  const markerConfig = displayMarkers.value[index]
  if (!markerConfig) return

  const match = filteredEstablishments.value.find(e => e.id === markerConfig.id)
    || filteredEstablishments.value.find(
      e => e.coordinates?.lat === markerConfig.position?.lat && e.coordinates?.lng === markerConfig.position?.lng
    )

  if (match) {
    onSelectEstablishment(match, false)
  }
}

const onLocateMeClick = async () => {
  try {
    const coords = await requestUserLocation({ enableHighAccuracy: true, watch: true })
    if (!selectedEstablishment.value) {
      mapCenter.value = coords
      mapZoom.value = 16
    }
  } catch {
  }
}
</script>

<template>
  <section class="w-full py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] mt-1">
          Discover places to stay (Hotels, Inns, Homestays, Resorts) and places to eat (Restaurants, Eateries, Cafes, Local Food Stalls) across San Francisco, Agusan del Sur with location details and direct navigation.
        </p>
      </div>
    </div>

    <div ref="mapViewContainerRef" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24">
      <div class="lg:col-span-6 space-y-3">
        <GoogleMap 
          :center="mapCenter"
          :zoom="mapZoom"
          :markers="displayMarkers"
          :active-marker-index="selectedMarkerIndex"
          height="400px"
          @marker-click="handleMarkerClick"
        />
      </div>
      <div class="lg:col-span-6 lg:sticky lg:top-20 space-y-3">
        <WhereToStayStreetView 
          :establishment="selectedEstablishment"
          :user-location="userLocation"
          :location-source="locationSource"
          :is-live-tracking="isLiveTracking"
          :is-locating="isLocating"
          :location-error="locationError"
          height="400px"
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
