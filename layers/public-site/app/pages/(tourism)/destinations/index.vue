<script setup lang="ts">
import { useDestinations, type Destination } from '../../../composables/useDestinations'
import DestinationFilters from '../../../components/destinations/DestinationFilters.vue'
import DestinationGrid from '../../../components/destinations/DestinationGrid.vue'
import DestinationDetailModal from '../../../components/destinations/DestinationDetailModal.vue'

definePageMeta({ 
  layout: 'guest' 
}) 

useHead({ 
  title: 'Destinations & Landmarks — Municipality of San Francisco, Agusan del Sur', 
  meta: [
    { 
      name: 'description', 
      content: 'Explore the iconic natural wonders, sacred mountains, ancient trees, and cultural heritage of San Francisco, Agusan del Sur including Mt. Magdiwata, Toog Tree of Alegria, Agusan Marsh, and Irosin Stone Crafts.' 
    }
  ] 
}) 

const {
  destinationsData,
  categories,
  searchQuery,
  selectedCategory,
  filteredDestinations,
  selectedDestination,
  selectDestination,
  selectCategory
} = useDestinations()

const isModalOpen = ref(false)

const handleSelectDestination = (item: Destination) => {
  selectDestination(item)
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
}

const handleResetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'All'
}
</script>

<template> 
  <div class="bg-[#ffffff] dark:bg-[#1c1c1c] min-h-dvh flex flex-col">
    <!-- Hero Section -->
    <UiHeroSection 
      title="Destinations & Landmarks" 
      description="Discover the natural wonders, sacred mountains, ancient landmarks, and rich cultural traditions of the Municipality of San Francisco, Agusan del Sur."
      image="/images/destinations/mt_magdiwata.jpg"
      image-alt="Mt. Magdiwata and San Francisco Agusan del Sur landscape"
    />

    <!-- Main Content Section -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-12">
      
      <!-- Filter Bar -->
      <DestinationFilters
        :categories="categories"
        :selected-category="selectedCategory"
        :search-query="searchQuery"
        :total-count="destinationsData.length"
        :filtered-count="filteredDestinations.length"
        @update:selected-category="selectCategory"
        @update:search-query="searchQuery = $event"
      />

      <!-- Destinations Grid -->
      <DestinationGrid
        :destinations="filteredDestinations"
        @select="handleSelectDestination"
        @reset-filters="handleResetFilters"
      />

      <!-- Municipal Tourism Office Advisory Box -->
      <section class="mt-16 p-8 md:p-10 rounded-2xl bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div class="space-y-2 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#85181a]/10 dark:bg-[#ef4444]/10 text-[#85181a] dark:text-[#ef4444]">
            Municipal Tourism Office
          </div>
          <h3 class="text-xl md:text-2xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
            Planning a Visit to San Francisco, Agusan del Sur?
          </h3>
          <p class="text-sm md:text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            Our local tourism officers are available to assist with guided tours, environmental clearance permits, and cultural visitation protocol for protected sites.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <NuxtLink 
            to="/citizen-charter" 
            class="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-[#dfdfdf] dark:border-[#333333] text-sm font-semibold text-[#171717] dark:text-[#ffffff] hover:bg-[#ffffff] dark:hover:bg-[#1a1a1a] transition-colors"
          >
            Citizen's Charter
          </NuxtLink>
          <a 
            href="mailto:tourism@sanfrancisco-ads.gov.ph"
            class="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-[#ffffff] bg-[#85181a] hover:bg-[#6b1214] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] transition-colors shadow-sm"
          >
            Inquire Tourism Office
          </a>
        </div>
      </section>

    </main>

    <DestinationDetailModal
      :destination="selectedDestination"
      :is-open="isModalOpen"
      @close="handleCloseModal"
    />
    <Footer />
  </div>
</template>