<script setup lang="ts">
import {
  Search,
  X,
  Filter,
  Calendar,
  FolderKanban,
  RotateCcw
} from '@lucide/vue'
import type { DisclosureCategory } from '../../composables/useFullDisclosure'

defineProps<{
  categories: DisclosureCategory[]
  availableYears: string[]
  availableQuarters: string[]
  selectedYear: string
  selectedQuarter: string
  selectedCategory: string
  searchQuery: string
  activeFiltersCount: number
  totalResults: number
}>()

const emit = defineEmits<{
  (e: 'update:selectedYear', val: string): void
  (e: 'update:selectedQuarter', val: string): void
  (e: 'update:selectedCategory', val: string): void
  (e: 'update:searchQuery', val: string): void
  (e: 'resetFilters'): void
}>()
</script>

<template>
  <div class="w-full bg-[#ffffff] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2a2a2a] rounded-md p-4 sm:p-6 space-y-4 shadow-xs">
    
    <!-- Top Row: Title & Active Filters / Reset -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#dfdfdf] dark:border-[#2a2a2a]">
      <div class="flex items-center gap-2">
        <Filter class="size-4 text-brand shrink-0" aria-hidden="true" />
        <h3 class="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary">
          Filter Compliance Documents
        </h3>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs text-[#707070] dark:text-[#a3a3a3]">
          Showing <strong class="text-primary font-semibold">{{ totalResults }}</strong> {{ totalResults === 1 ? 'document' : 'documents' }}
        </span>
        <button
          v-if="activeFiltersCount > 0"
          type="button"
          @click="emit('resetFilters')"
          class="inline-flex items-center gap-1.5 text-xs text-brand hover:underline font-medium cursor-pointer transition-colors"
        >
          <RotateCcw class="size-3.5" />
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Main Filter Controls Grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">

      <!-- Search Input (4 cols) -->
      <div class="md:col-span-4 space-y-1.5">
        <label class="block text-[11px] uppercase tracking-wider font-medium text-[#707070] dark:text-[#a3a3a3]">
          Search Documents
        </label>
        <div class="relative">
          <input
            :value="searchQuery"
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Search by title, keyword, office..."
            class="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] text-primary placeholder-[#707070] dark:placeholder-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#ffffff] transition-colors"
          />
          <Search class="size-4 text-[#707070] dark:text-[#a3a3a3] absolute left-2.5 top-2.5 sm:top-3 pointer-events-none" aria-hidden="true" />
          <button
            v-if="searchQuery"
            type="button"
            @click="emit('update:searchQuery', '')"
            class="absolute right-2.5 top-2.5 sm:top-3 text-[#707070] hover:text-primary transition-colors cursor-pointer"
            aria-label="Clear search input"
          >
            <X class="size-4" />
          </button>
        </div>
      </div>

      <!-- Filter by Year (3 cols) -->
      <div class="md:col-span-3 space-y-1.5">
        <label class="text-[11px] uppercase tracking-wider font-medium text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5">
          <Calendar class="size-3.5 text-[#707070] dark:text-[#a3a3a3]" />
          Filter by Year
        </label>
        <div class="flex flex-wrap gap-1 bg-[#fafafa] dark:bg-[#252525] p-1 rounded-sm border border-[#dfdfdf] dark:border-[#333333]">
          <button
            v-for="yr in availableYears"
            :key="yr"
            type="button"
            @click="emit('update:selectedYear', yr)"
            :class="[
              'flex-1 min-w-12.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer text-center',
              selectedYear === yr
                ? 'bg-[#ffffff] dark:bg-[#1c1c1c] text-primary border border-[#dfdfdf] dark:border-[#3a3a3a] shadow-xs'
                : 'text-[#707070] dark:text-[#a3a3a3] hover:text-primary hover:bg-[#ffffff]/50 dark:hover:bg-[#1c1c1c]/50'
            ]"
          >
            {{ yr === 'All' ? 'All Years' : yr }}
          </button>
        </div>
      </div>

      <!-- Filter by Category Dropdown (5 cols) -->
      <div class="md:col-span-5 space-y-1.5">
        <label class="block text-[11px] uppercase tracking-wider font-medium text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5">
          <FolderKanban class="size-3.5 text-[#707070] dark:text-[#a3a3a3]" />
          Filter by Document Category
        </label>
        <select
          :value="selectedCategory"
          @change="emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
          class="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] text-primary focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#ffffff] transition-colors cursor-pointer"
        >
          <option value="All">All Categories (9 DILG Reports)</option>
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.title }}
          </option>
        </select>
      </div>

    </div>

    <!-- Filter by Quarter (Segmented Pills Row) -->
    <div class="pt-2 border-t border-[#dfdfdf]/60 dark:border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center gap-2">
      <span class="text-[11px] uppercase tracking-wider font-medium text-[#707070] dark:text-[#a3a3a3] shrink-0">
        Filter by Quarter:
      </span>
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          v-for="qtr in availableQuarters"
          :key="qtr"
          type="button"
          @click="emit('update:selectedQuarter', qtr)"
          :class="[
            'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
            selectedQuarter === qtr
              ? 'bg-brand text-white shadow-xs'
              : 'bg-[#fafafa] dark:bg-[#252525] text-[#707070] dark:text-[#a3a3a3] border border-[#dfdfdf] dark:border-[#333333] hover:border-brand hover:text-brand'
          ]"
        >
          {{ qtr === 'All' ? 'All Periods' : qtr }}
        </button>
      </div>
    </div>

  </div>
</template>
