<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDestinations, type Destination } from '../../../composables/useDestinations'
import DestinationFilters from '../../../components/destinations/DestinationFilters.vue'
import DestinationGrid from '../../../components/destinations/DestinationGrid.vue'

definePageMeta({ 
  layout: 'guest' 
}) 

useHead({ 
  title: 'Destinations & Landmarks — Municipality of San Francisco, Agusan del Sur', 
  meta: [
    { 
      name: 'description', 
      content: 'Explore the iconic natural wonders, inland resorts, sacred churches, parks, and cultural landmarks of San Francisco, Agusan del Sur.' 
    }
  ] 
}) 

const router = useRouter()
const {
  destinationsData,
  categories,
  searchQuery,
  selectedCategory,
  filteredDestinations,
  paginatedDestinations,
  currentPage,
  totalPages,
  searchSuggestions,
  mapMarkers,
  viewMode,
  selectCategory,
  toggleViewMode,
  goToPage
} = useDestinations()

// Display list: use paginated list in grid mode, full filtered list in map mode for complete sidebar listing
const activeDisplayDestinations = computed(() => {
  return viewMode.value === 'map' ? filteredDestinations.value : paginatedDestinations.value
})

const handleSelectDestination = (item: Destination) => {
  router.push(`/destinations/${item.id}`)
}

const handleResetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'All'
}
</script>

<template> 
  <div class="bg-[#ffffff] dark:bg-[#141414] min-h-dvh flex flex-col">
    <!-- Hero Section -->
    <UiHeroSection 
      title="Destinations & Landmarks" 
      description="Discover the natural wonders, sacred mountains, inland resorts, and rich cultural traditions of the Municipality of San Francisco, Agusan del Sur."
      image="https://firebasestorage.googleapis.com/v0/b/tologan-8554a.firebasestorage.app/o/place_photos%2Findland_resorts_carson_waterside_mountain_resort_8.489293_125.984219_photo_1_1771539863241.jpg?alt=media&token=167a0b54-bd82-418f-bc22-cc70fe5774ce"
      image-alt="San Francisco Agusan del Sur landscape"
    />

    <!-- Main Content Section -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-10">
      
      <!-- Filter Bar & View Toggle -->
      <DestinationFilters
        :categories="categories"
        :selected-category="selectedCategory"
        :search-query="searchQuery"
        :total-count="destinationsData.length"
        :filtered-count="filteredDestinations.length"
        :view-mode="viewMode"
        :search-suggestions="searchSuggestions"
        @update:selected-category="selectCategory"
        @update:search-query="searchQuery = $event"
        @update:view-mode="toggleViewMode"
      />

      <!-- Destinations Grid / Map View -->
      <DestinationGrid
        :destinations="activeDisplayDestinations"
        :view-mode="viewMode"
        :map-markers="mapMarkers"
        :current-page="currentPage"
        :total-pages="totalPages"
        @select="handleSelectDestination"
        @reset-filters="handleResetFilters"
        @page-change="goToPage"
      />
    </main>

    <Footer />
  </div>
</template>


