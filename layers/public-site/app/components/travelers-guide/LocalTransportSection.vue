<script setup lang="ts">
import {
  Search,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from '@lucide/vue'
import { useLocalFares } from '../../composables/useLocalFares'

const {
  pending,
  error,
  searchQuery,
  selectedOrigin,
  selectedMode,
  fromLocations,
  availableModes,
  filteredFares
} = useLocalFares()


const currentPage = ref(1)
const itemsPerPage = ref(4)

const totalItems = computed(() => filteredFares.value.length)

const itemsPerPageNum = computed(() => Number(itemsPerPage.value) || 4)

const totalPages = computed(() => {
  if (totalItems.value === 0) return 1
  return Math.ceil(totalItems.value / itemsPerPageNum.value)
})

const startItem = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * itemsPerPageNum.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPageNum.value, totalItems.value)
})

const paginatedFares = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPageNum.value
  const end = start + itemsPerPageNum.value
  return filteredFares.value.slice(start, end)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch([searchQuery, selectedOrigin, selectedMode, itemsPerPage], () => {
  currentPage.value = 1
})
</script>

<template>
  <section id="local-fares" class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-tight text-[#171717] dark:text-[#ffffff]">
      Fare Matrix
      </h2>
      <p class="text-base text-[#707070] dark:text-[#a3a3a3] max-w-3xl">
        Official regulated passenger fares, vehicle options, and estimated transit times across San Francisco, Agusan del Sur, including key routes connecting Poblacion, New Terminal Hubang, and eco-tourism sites.
      </p>
    </div>

    <div class="bg-[#fafafa] dark:bg-[#202020] p-4 md:p-5 rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <!-- Search bar -->
        <div class="md:col-span-5 relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#707070] dark:text-[#a3a3a3]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search route (e.g. Hubang, Magdiwata, Alegria)..."
            class="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] placeholder-[#707070] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#85181a] dark:focus:ring-[#ef4444]"
          />
        </div>

        <!-- Origin selector -->
        <div class="md:col-span-4 flex items-center gap-2">
          <label class="text-xs font-semibold text-[#707070] dark:text-[#a3a3a3] shrink-0">From:</label>
          <select
            v-model="selectedOrigin"
            class="w-full py-2 px-3 text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#85181a]"
          >
            <option v-for="loc in fromLocations" :key="loc" :value="loc">
              {{ loc === 'All' ? 'All Origins' : loc }}
            </option>
          </select>
        </div>

        <!-- Mode selector -->
        <div class="md:col-span-3 flex items-center gap-2">
          <label class="text-xs font-semibold text-[#707070] dark:text-[#a3a3a3] shrink-0">Mode:</label>
          <select
            v-model="selectedMode"
            class="w-full py-2 px-3 text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#85181a]"
          >
            <option v-for="m in availableModes" :key="m" :value="m">
              {{ m === 'All' ? 'All Vehicles' : m }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="pending" class="py-12 text-center text-[#707070] dark:text-[#a3a3a3] animate-pulse">
      Loading official fare matrix...
    </div>

    <div v-else-if="error" class="p-6 text-center text-red-600 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900">
      Failed to load fare data. Please refresh or contact Municipal Tourism Desk.
    </div>

    <div v-else-if="filteredFares.length === 0" class="py-12 text-center space-y-2 border rounded-xl border-dashed p-8">
      <HelpCircle class="w-8 h-8 text-[#707070] mx-auto" />
      <h3 class="text-base font-semibold text-[#171717] dark:text-[#ffffff]">No routes found</h3>
      <p class="text-xs text-[#707070] dark:text-[#a3a3a3]">
        Try adjusting your search criteria or selecting "All Origins".
      </p>
    </div>

    <div v-else class="overflow-hidden rounded-md border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#1c1c1c]">
      <div class="overflow-x-auto relative">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-[#fafafa] dark:bg-[#202020] border-b border-[#dfdfdf] dark:border-[#2e2e2e] text-[#171717] dark:text-[#ffffff]">
              <th class="py-3.5 px-4 font-semibold sticky left-0 z-20 bg-[#fafafa] dark:bg-[#202020] border-r border-[#dfdfdf] dark:border-[#2e2e2e] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] min-w-35 whitespace-nowrap">
                Origin
              </th>
              <th class="py-3.5 px-4 font-semibold whitespace-nowrap">Destination</th>
              <th class="py-3.5 px-4 font-semibold whitespace-nowrap">Vehicle</th>
              <th class="py-3.5 px-4 font-semibold whitespace-nowrap">Est. Time</th>
              <th class="py-3.5 px-4 font-semibold whitespace-nowrap">Regular Fare</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#dfdfdf] dark:divide-[#2e2e2e]">
            <tr
              v-for="f in paginatedFares"
              :key="f.id"
              class="group hover:bg-[#fafafa] dark:hover:bg-[#202020]/60 transition-colors"
            >
              <td class="py-3.5 px-4 font-semibold sticky left-0 z-10 bg-[#ffffff] dark:bg-[#1c1c1c] group-hover:bg-[#fafafa] dark:group-hover:bg-[#202020] border-r border-[#dfdfdf] dark:border-[#2e2e2e] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] text-[#171717] dark:text-[#ffffff] min-w-35 whitespace-nowrap">
                {{ f.from }}
              </td>
              <td class="py-3.5 px-4 font-medium text-[#171717] dark:text-[#ffffff] whitespace-nowrap">
                {{ f.to }}
              </td>
              <td class="py-3.5 px-4 min-w-37.5 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#fafafa] dark:bg-[#252525] border border-[#dfdfdf] dark:border-[#333333] text-[#171717] dark:text-[#d4d4d4]">
        
                  {{ f.mode }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-xs text-[#707070] dark:text-[#a3a3a3] whitespace-nowrap">
                {{ f.estimatedTime || 'N/A' }}
              </td>
              <td class="py-3.5 px-4 font-bold text-[#85181a] dark:text-[#ef4444] whitespace-nowrap">
                {{ f.fare }}
              </td>
              
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 py-3 bg-[#fafafa] dark:bg-[#202020] border-t border-[#dfdfdf] dark:border-[#2e2e2e] flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Item Summary & Page Size -->
        <div class="flex flex-wrap items-center gap-4 text-xs text-[#707070] dark:text-[#a3a3a3]">
          <div>
            Showing <strong class="text-[#171717] dark:text-[#ffffff]">{{ startItem }}</strong> to
            <strong class="text-[#171717] dark:text-[#ffffff]">{{ endItem }}</strong> of
            <strong class="text-[#171717] dark:text-[#ffffff]">{{ totalItems }}</strong> routes
          </div>

          <div class="flex items-center gap-1.5">
            <label for="itemsPerPageSelect" class="shrink-0 font-medium">Per page:</label>
            <select
              id="itemsPerPageSelect"
              v-model.number="itemsPerPage"
              class="py-1 px-2 text-xs rounded border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] focus:outline-none focus:ring-1 focus:ring-[#85181a]"
            >
              <option :value="4">4 routes</option>
              <option :value="8">8 routes</option>
              <option :value="12">12 routes</option>
              <option :value="1000">All routes</option>
            </select>
          </div>
        </div>

        <!-- Page Buttons -->
        <div v-if="totalPages > 1" class="flex items-center gap-1.5">
          <!-- Previous Button -->
          <button
            type="button"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#252525] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            :disabled="currentPage === 1"
            aria-label="Previous Page"
            @click="goToPage(currentPage - 1)"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <!-- Page Numbers -->
          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            :class="page === currentPage
              ? 'bg-[#85181a] dark:bg-[#ef4444] text-[#ffffff] shadow-sm'
              : 'border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#252525]'"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <!-- Next Button -->
          <button
            type="button"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#252525] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            :disabled="currentPage === totalPages"
            aria-label="Next Page"
            @click="goToPage(currentPage + 1)"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>