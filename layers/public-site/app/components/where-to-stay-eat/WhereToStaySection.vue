<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useWhereToStayEat, type Establishment } from '../../composables/useWhereToStayEat'
import WhereToStayTags from './WhereToStayTags.vue'
import WhereToStayList from './WhereToStayList.vue'
import WhereToStayStreetView from './WhereToStayStreetView.vue'
import GoogleMap from '../GoogleMap.vue'
import { 
  Building2, 
  MapPin, 
  Phone, 
  X, 
  ExternalLink, 
  Check, 
  Copy, 
  Navigation,
  Compass,
  Table,
  Eye,
  Layers,
  LayoutGrid
} from '@lucide/vue'

const {
  categories,
  barangays,
  categoryCounts,
  searchQuery,
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
  selectCategory,
  selectBarangay,
  selectEstablishment
} = useWhereToStayEat()

const mapCenter = ref({ lat: 8.5042, lng: 125.9786 })
const mapZoom = ref(15)
const customMarkedLocation = ref<{ lat: number; lng: number } | null>(null)
const mapViewContainerRef = ref<HTMLElement | null>(null)

// Auto-select first establishment in category if none is selected
onMounted(() => {
  if (!selectedEstablishment.value && filteredEstablishments.value.length > 0) {
    selectEstablishment(filteredEstablishments.value[0]!)
    if (filteredEstablishments.value[0]?.coordinates) {
      mapCenter.value = filteredEstablishments.value[0].coordinates!
      customMarkedLocation.value = filteredEstablishments.value[0].coordinates!
    }
  }
})

watch(filteredEstablishments, (newList) => {
  if (newList.length > 0 && (!selectedEstablishment.value || !newList.some(e => e.id === selectedEstablishment.value?.id))) {
    selectEstablishment(newList[0]!)
    if (newList[0]?.coordinates) {
      mapCenter.value = newList[0].coordinates!
      customMarkedLocation.value = newList[0].coordinates!
    }
  }
})

const onSelectEstablishment = (item: Establishment, shouldScroll = true) => {
  selectEstablishment(item)
  if (item.coordinates) {
    mapCenter.value = item.coordinates
    customMarkedLocation.value = item.coordinates
    mapZoom.value = 17
  }

  // Smoothly scroll back to top Map & Street View container when Focus button is clicked
  if (shouldScroll && mapViewContainerRef.value) {
    mapViewContainerRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Handle arbitrary clicks anywhere on the Google Map to point Street View
const handleMapClick = (e: google.maps.MapMouseEvent) => {
  if (e.latLng) {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() }
    customMarkedLocation.value = coords

    // Check if click is near any establishment
    const matched = establishmentsData.find(item => {
      if (!item.coordinates) return false
      const dLat = Math.abs(item.coordinates.lat - coords.lat)
      const dLng = Math.abs(item.coordinates.lng - coords.lng)
      return dLat < 0.0025 && dLng < 0.0025
    })

    if (matched) {
      selectEstablishment(matched)
    } else {
      selectEstablishment(null)
    }
  }
}

const handleMarkerClick = (marker: any, index: number) => {
  const matchingItem = filteredEstablishments.value[index]
  if (matchingItem) {
    onSelectEstablishment(matchingItem, false)
  }
}
</script>

<template>
  <section class="w-full py-4 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 shadow-xs">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-[#ffffff]">
              <span>Interactive Directory Map & Street View 360°</span>
        </h2>
        <p class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] mt-1">
          Search hotels, restaurants, cafes, spas, salons, malls, and clinics across San Francisco, Agusan del Sur.
        </p>
      </div>
    </div>

    <WhereToStayTags 
      :categories="categories"
      :category-counts="categoryCounts"
      :selected-category="selectedCategory"
      :selected-barangay="selectedBarangay"
      :barangays="barangays"
      :search-query="searchQuery"
      :establishments="establishmentsData"
      :filtered-count="filteredEstablishments.length"
      :total-count="establishmentsData.length"
      @update:selected-category="selectCategory"
      @update:selected-barangay="selectBarangay"
      @update:search-query="searchQuery = $event"
      @select-establishment="onSelectEstablishment($event, true)"
    />

    <!-- Main Split Layout: Clean Map ON THE LEFT, Street View ON THE RIGHT -->
    <div ref="mapViewContainerRef" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24">
      
      <!-- LEFT COLUMN: Clean Google Map -->
      <div class="lg:col-span-6 space-y-3">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5">
            <MapPin :size="15" class="text-[#85181a] dark:text-[#ef4444]" />
            Location Map — {{ selectedCategory }} (Click any point or pin to update Street View)
          </h3>
        </div>

        <GoogleMap 
          :center="mapCenter"
          :zoom="mapZoom"
          :markers="mapMarkers"
          height="540px"
          center-address="San Francisco, Agusan del Sur, Philippines"
          @click="handleMapClick"
          @marker-click="handleMarkerClick"
        />
      </div>

      <!-- RIGHT COLUMN: 360° Street View Panorama following marked position in real-time -->
      <div class="lg:col-span-6 lg:sticky lg:top-20 space-y-3">
        <WhereToStayStreetView 
          :establishment="selectedEstablishment"
          :custom-location="customMarkedLocation"
          height="580px"
        />
      </div>

    </div>

    <!-- DIRECTORY SECTION (CARDS VIEW AS DEFAULT, TABLE VIEW OPTIONAL) -->
    <div class="pt-6 border-t border-[#dfdfdf] dark:border-[#2e2e2e] space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-lg font-bold text-[#171717] dark:text-[#ffffff] flex items-center gap-2">
            <LayoutGrid :size="20" class="text-[#85181a] dark:text-[#ef4444]" />
            Establishments Showcase — {{ selectedCategory }}
          </h3>
          <p class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-0.5">
            Card view is shown by default. Toggle to table view for a compact spreadsheet layout.
          </p>
        </div>

        <!-- View Mode Switcher: Cards View Default vs Table View Optional -->
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

      <WhereToStayList 
        :establishments="paginatedEstablishments"
        :total-count="filteredEstablishments.length"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        :view-mode="viewMode"
        :active-id="activeEstablishmentId"
        :current-category="selectedCategory"
        @select="onSelectEstablishment($event, true)"
        @update:current-page="currentPage = $event"
      />
    </div>

  </section>
</template>
