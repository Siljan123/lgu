<script setup lang="ts">
import { ref } from 'vue'
import { useEventsFestivals, type EventFestival } from '../../../composables/useEventsFestivals'
import EventFilters from '../../../components/events-festivals/EventFilters.vue'
import EventGrid from '../../../components/events-festivals/EventGrid.vue'
import EventDetailModal from '../../../components/events-festivals/EventDetailModal.vue'
import EventRoadmapSection from '../../../components/events-festivals/EventRoadmapSection.vue'

definePageMeta({ 
  layout: 'guest' 
}) 

useHead({ 
  title: 'Events & Festivals — Municipality of San Francisco, Agusan del Sur', 
  meta: [
    { 
      name: 'description', 
      content: 'Experience the Diwata / Magdiwata Festival, cultural heritage celebrations, and municipal observances in San Francisco, Agusan del Sur.' 
    }
  ] 
}) 

const {
  eventsData,
  recurringEventsData,
  categories,
  searchQuery,
  selectedCategory,
  filteredEvents,
  selectedEvent,
  selectEvent,
  selectCategory
} = useEventsFestivals()

const isModalOpen = ref(false)

const handleSelectEvent = (item: EventFestival) => {
  selectEvent(item)
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
      title="Events & Festivals" 
      description="Celebrate the vibrant culture, indigenous Manobo heritage, and environmental watershed legacy of the Municipality of San Francisco, Agusan del Sur."
      image="/images/destinations/mt_magdiwata.jpg"
      image-alt="Diwata Festival and Mt. Magdiwata landscape"
    />

    <!-- Main Content Section -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-16">
      
      <!-- Filter Bar -->
      <EventFilters
        :categories="categories"
        :selected-category="selectedCategory"
        :search-query="searchQuery"
        :total-count="eventsData.length"
        :filtered-count="filteredEvents.length"
        @update:selected-category="selectCategory"
        @update:search-query="searchQuery = $event"
      />

      <!-- Events & Festivals Grid -->
      <EventGrid
        :events="filteredEvents"
        @select="handleSelectEvent"
        @reset-filters="handleResetFilters"
      />

      <!-- Recurring Events & Content Roadmap Section -->
      <EventRoadmapSection
        :recurring-events="recurringEventsData"
      />

      <!-- Municipal Tourism Advisory Section -->
      <section class="p-8 md:p-10 rounded-2xl bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div class="space-y-2 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#85181a]/10 dark:bg-[#ef4444]/10 text-[#85181a] dark:text-[#ef4444]">
            Municipal Tourism Office
          </div>
          <h3 class="text-xl md:text-2xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
            Participating in San Francisco Festivals?
          </h3>
          <p class="text-sm md:text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            For street dancing registration, trade fair stall accreditation, or environmental summit passes, contact the Municipal Tourism Office or check our official bulletins.
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

    <!-- Event Detail Modal -->
    <EventDetailModal
      :event="selectedEvent"
      :is-open="isModalOpen"
      @close="handleCloseModal"
    />
    <Footer />
  </div>
</template>