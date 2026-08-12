<script setup lang="ts">
import { useFullDisclosure } from '../../composables/useFullDisclosure'
import DisclosureFilterBar from './DisclosureFilterBar.vue'
import DisclosureDocumentList from './DisclosureDocumentList.vue'
import { ShieldCheck, FileCheck, Landmark } from '@lucide/vue'

const {
  categories,
  selectedYear,
  selectedQuarter,
  selectedCategory,
  searchQuery,
  availableYears,
  availableQuarters,
  categoryDocumentCounts,
  filteredDocuments,
  activeFiltersCount,
  resetFilters,
  selectCategory
} = useFullDisclosure()
</script>

<template>
  <section class="w-full bg-[#fafafa] dark:bg-[#1c1c1c] text-primary py-12 md:py-16 transition-colors">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-12">

      <!-- DILG Compliance Highlights Banner -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div class="flex items-start gap-4">
          <div class="size-12 rounded-xl bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shrink-0">
            <Landmark class="size-6" />
          </div>
          <div class="space-y-1 max-w-3xl">
            <h2 class="text-2lg sm:text-2xl font-medium tracking-tight text-primary">
              Full Disclosure Policy (FDP) Portal
            </h2>
            <p class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
              Mandated by DILG Memorandum Circulars, this portal provides public access to all official financial operations, fund utilization reports, and procurement records of San Francisco, Agusan del Sur.
            </p>
          </div>
        </div>
      </div>


      <!-- Section 2: Interactive Filter Bar -->
      <DisclosureFilterBar
        :categories="categories"
        :availableYears="availableYears"
        :availableQuarters="availableQuarters"
        v-model:selectedYear="selectedYear"
        v-model:selectedQuarter="selectedQuarter"
        v-model:selectedCategory="selectedCategory"
        v-model:searchQuery="searchQuery"
        :activeFiltersCount="activeFiltersCount"
        :totalResults="filteredDocuments.length"
        @resetFilters="resetFilters"
      />

      <!-- Section 3: Document Entries List -->
      <DisclosureDocumentList
        :documents="filteredDocuments"
        :activeFiltersCount="activeFiltersCount"
        @resetFilters="resetFilters"
      />

    </div>
  </section>
</template>
