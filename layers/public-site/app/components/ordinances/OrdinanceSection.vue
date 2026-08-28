<script setup lang="ts">
import { ref } from 'vue'
import {
  FileText,
  Scale,
  Landmark,
  Loader2,
  BookOpen,
} from '@lucide/vue'
import { useOrdinances } from '../../composables/useOrdinances'
import type { LegalDocument } from '../../../types/ordinance'
import OrdinanceStats from './OrdinanceStats.vue'
import OrdinanceFilterBar from './OrdinanceFilterBar.vue'
import OrdinanceCard from './OrdinanceCard.vue'
import OrdinanceTable from './OrdinanceTable.vue'
import OrdinanceDetailModal from './OrdinanceDetailModal.vue'

const {
  rawDocuments,
  filteredDocuments,
  stats,
  searchQuery,
  selectedType,
  selectedStatus,
  selectedYear,
  selectedTag,
  availableYears,
  availableTags,
  activeFiltersCount,
  pending,
  resetFilters,
} = useOrdinances()

const latestDocument = computed<LegalDocument | null>(() => {
  const docs = rawDocuments.value || []
  if (docs.length === 0) return null
  const withPdf = docs.find((d) => d.pdf_url && d.pdf_url !== '#' && d.pdf_url.endsWith('.pdf'))
  return withPdf || docs[0] || null
})

const isDetailModalOpen = ref(false)
const selectedDoc = ref<LegalDocument | null>(null)

function handleOpenView(doc: LegalDocument) {
  selectedDoc.value = doc
  isDetailModalOpen.value = true
}
</script>

<template>
  <section class="w-full  bg-background  p-9 transition-colors">
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="max-w-7xl mx-auto">
        <div class="space-y-1 max-w-3xl">
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Legislative & Executive Registry
          </h2>
          <p class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
             Official public repository of municipal ordinances enacted by the Sangguniang Bayan, executive orders issued by the Municipal Mayor, and official resolutions of San Francisco, Agusan del Sur.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="w-full bg-[#fafafa] dark:bg-[#121212] py-8 transition-colors">
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="max-w-7xl mx-auto">
        <OrdinanceStats
            :stats="stats"
            :latest-document="latestDocument"
            @view="handleOpenView"
        />
      </div>
    </div>
 
  </section>

  <section class="w-full dark:bg-[#121212] py-8 transition-colors">
    <div class="max-w-7xl mx-auto">
      <OrdinanceFilterBar
        v-model:searchQuery="searchQuery"
        v-model:selectedType="selectedType"
        v-model:selectedStatus="selectedStatus"
        v-model:selectedYear="selectedYear"
        v-model:selectedTag="selectedTag"
        :availableYears="availableYears"
        :availableTags="availableTags"
        :stats="stats"
        :activeFiltersCount="activeFiltersCount"
        :isAdmin="false"
        @resetFilters="resetFilters"
      />
    </div>
    <div v-if="pending" class="py-20 flex flex-col items-center max-w-7xl mx-auto justify-center space-y-3 text-neutral-500">
      <Loader2 class="size-8 animate-spin text-[#dc2626]" />
      <span class="text-xs">Loading official repository...</span>
    </div>
    
    <div class="max-w-7xl mx-auto">
      <div
        v-if="filteredDocuments.length > 0"
        class=" gap-4 sm:gap-5"
      >
        <OrdinanceCard
          v-for="doc in filteredDocuments"
          :key="doc.id"
            :document="doc"
            :isAdmin="false"
            @view="handleOpenView"
        />
      </div>

      <div
        v-else
        class="py-16 text-center border-[#dfdfdf] dark:border-[#333333] space-y-3 p-6"
      >
        <div class="size-12 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center">
          <FileText class="size-6" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-neutral-900 dark:text-white">No documents found</h4>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            No legal documents match your current filter criteria or search keyword.
          </p>
        </div>
        <div v-if="activeFiltersCount > 0" class="pt-2">
          <button
            type="button"
            @click="resetFilters"
            class="px-3.5 py-2 text-xs font-medium text-[#dc2626] bg-[#dc2626]/10 rounded-md hover:bg-[#dc2626]/20 transition cursor-pointer"
          >
          Clear All Filters
          </button>
        </div>
      </div>
    </div>
  </section>
  <OrdinanceDetailModal
    :open="isDetailModalOpen"
    :document="selectedDoc"
    @close="isDetailModalOpen = false"
  />
</template>
