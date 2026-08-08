<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Calendar, Sparkles } from '@lucide/vue'
import { useEventsFestivals, type Festival, type EventItem, type EventFestival } from '../../../composables/useEventsFestivals'
import EventFilters from '../../../components/events-festivals/EventFilters.vue'
import FestivalAboutCard from '../../../components/events-festivals/FestivalAboutCard.vue'
import UpcomingEventCard from '../../../components/events-festivals/UpcomingEventCard.vue'
import EventPagination from '../../../components/events-festivals/EventPagination.vue'
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
  festivalsData,
  eventsData,
  allEvents,
  recurringEventsData,
  categories,
  searchQuery,
  selectedCategory,
  filteredEvents,
  filteredUpcomingEvents,
  generalUpcomingEvents,
  eventsForFestival,
  selectedEvent,
  selectEvent,
  selectCategory
} = useEventsFestivals()

const isModalOpen = ref(false)
const modalEventItem = ref<EventFestival | null>(null)

// Pagination state for Upcoming Events Feed
const currentPage = ref(1)
const itemsPerPage = 6

const totalUpcomingPages = computed(() => {
  return Math.ceil(filteredUpcomingEvents.value.length / itemsPerPage)
})

const paginatedUpcomingEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUpcomingEvents.value.slice(start, start + itemsPerPage)
})

watch([selectedCategory, searchQuery], () => {
  currentPage.value = 1
})

const handleSelectEvent = (item: EventFestival | EventItem) => {
  if ('tagline' in item) {
    selectEvent(item)
    modalEventItem.value = item
  } else {
    const mapped: EventFestival = {
      id: item.id,
      slug: item.id,
      name: item.title,
      tagline: item.badge || item.category,
      category: item.category as any,
      whenHeld: item.startDate + (item.endDate ? ` – ${item.endDate}` : ''),
      venue: item.location,
      shortDescription: item.shortDescription,
      fullDescription: item.fullDescription || item.shortDescription,
      highlights: [],
      whyItMatters: 'Official municipal event organized for the community of San Francisco, Agusan del Sur.',
      howToAttend: 'Open to the public at the designated venue.',
      isFlagship: item.isFeatured || false,
      image: item.image || '/images/destinations/mt_magdiwata.jpg',
      organizer: item.organizer || 'LGU San Francisco',
      tags: [item.category]
    }
    modalEventItem.value = mapped
  }
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
}

const handleResetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'All'
}

// Filtered festivals based on category and search
const filteredFestivals = computed(() => {
  return festivalsData.filter(festival => {
    const matchesCategory = selectedCategory.value === 'All' || festival.category === selectedCategory.value
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query 
      || festival.name.toLowerCase().includes(query)
      || festival.shortDescription.toLowerCase().includes(query)
      || festival.tags.some(t => t.toLowerCase().includes(query))

    return matchesCategory && matchesSearch
  })
})
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
        :total-count="festivalsData.length + allEvents.length"
        :filtered-count="filteredFestivals.length + filteredUpcomingEvents.length"
        @update:selected-category="selectCategory"
        @update:search-query="searchQuery = $event"
      />

      <!-- Festivals Section (Static Identity Blocks with Live Events Underneath) -->
      <section v-if="filteredFestivals.length > 0" class="space-y-8">
        <div class="border-b border-[#dfdfdf] dark:border-[#2e2e2e] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-2xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
              Municipal Festivals & Celebrations
            </h2>
            <p class="text-xs md:text-sm text-[#707070] dark:text-[#a3a3a3] mt-0.5">
              Cultural identity & heritage write-ups with live, scheduled festival activities listed underneath.
            </p>
          </div>
        </div>

        <div class="space-y-10">
          <FestivalAboutCard 
            v-for="festival in filteredFestivals"
            :key="festival.id"
            :festival="festival"
            :events="eventsForFestival(festival.slug)"
            @select-event="handleSelectEvent"
          />
        </div>
      </section>

      <!-- General Upcoming Events Feed Section -->
      <section class="space-y-8">
        <div class="border-b border-[#dfdfdf] dark:border-[#2e2e2e] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-2xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff] flex items-center gap-2">
              <Calendar :size="22" class="text-[#85181a] dark:text-[#ef4444]" />
              Upcoming Events Feed
            </h2>
            <p class="text-xs md:text-sm text-[#707070] dark:text-[#a3a3a3] mt-0.5">
              Dynamic scheduled entries for civic, community, agricultural, and holiday town programs.
            </p>
          </div>
        </div>

        <!-- Paginated Events Feed -->
        <div 
          v-if="filteredUpcomingEvents.length > 0"
          class="space-y-8"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UpcomingEventCard
              v-for="event in paginatedUpcomingEvents"
              :key="event.id"
              :event="event"
              @select="handleSelectEvent"
            />
          </div>

          <!-- Pagination Bar -->
          <EventPagination
            v-model:current-page="currentPage"
            :total-pages="totalUpcomingPages"
            :total-items="filteredUpcomingEvents.length"
            :items-per-page="itemsPerPage"
          />
        </div>

        <div 
          v-else-if="filteredFestivals.length === 0"
          class="w-full p-12 text-center rounded-2xl border border-dashed border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1a1a1a]"
        >
          <p class="text-base text-[#707070] dark:text-[#a3a3a3]">
            No events found matching your criteria. Try switching categories or clearing search.
          </p>
        </div>
      </section>

      <!-- Recurring Events & Content Roadmap Section -->
      <EventRoadmapSection
        :recurring-events="recurringEventsData"
      />

    </main>

    <!-- Event Detail Modal -->
    <EventDetailModal
      :event="modalEventItem"
      :is-open="isModalOpen"
      @close="handleCloseModal"
    />
    <Footer />
  </div>
</template>