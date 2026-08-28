<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Scale,
} from '@lucide/vue'
import { useOrdinances } from '../../composables/useOrdinances'
import type {
  LegalDocument,
  CreateLegalDocumentPayload,
  UpdateLegalDocumentPayload,
} from '../../../types/ordinance'

import OrdinanceStats from './OrdinanceStats.vue'
import OrdinanceFilterBar from './OrdinanceFilterBar.vue'
import OrdinanceTable from './OrdinanceTable.vue'
import OrdinanceDetailModal from './OrdinanceDetailModal.vue'
import OrdinanceAddModal from './OrdinanceAddModal.vue'
import OrdinanceEditModal from './OrdinanceEditModal.vue'
import OrdinanceDeleteModal from './OrdinanceDeleteModal.vue'

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
  createDocument,
  updateDocument,
  deleteDocument,
} = useOrdinances()

// Latest Document for Preview Card
const latestDocument = computed<LegalDocument | null>(() => {
  const docs = rawDocuments.value || []
  if (docs.length === 0) return null
  const withPdf = docs.find((d) => d.pdf_url && d.pdf_url !== '#' && d.pdf_url.endsWith('.pdf'))
  return withPdf || docs[0] || null
})

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Reset pagination to page 1 on any filter/search changes
watch([searchQuery, selectedType, selectedStatus, selectedYear, selectedTag], () => {
  currentPage.value = 1
})

// Paginated documents slice
const paginatedDocuments = computed<LegalDocument[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredDocuments.value.slice(start, start + itemsPerPage.value)
})

// Modal States
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const targetDocument = ref<LegalDocument | null>(null)

function handleOpenAdd() {
  isAddModalOpen.value = true
}

function handleOpenView(doc: LegalDocument) {
  targetDocument.value = doc
  isDetailModalOpen.value = true
}

function handleOpenEdit(doc: LegalDocument) {
  targetDocument.value = doc
  isEditModalOpen.value = true
}

function handleOpenDelete(doc: LegalDocument) {
  targetDocument.value = doc
  isDeleteModalOpen.value = true
}

function handleDownload(doc: LegalDocument) {
  if (doc.pdf_url && doc.pdf_url !== '#') {
    window.open(doc.pdf_url, '_blank')
  }
}

async function handleCreate(payload: CreateLegalDocumentPayload) {
  try {
    await createDocument(payload)
    isAddModalOpen.value = false
  } catch (err) {
    console.error('Failed to create document:', err)
  }
}

async function handleUpdate(payload: UpdateLegalDocumentPayload) {
  try {
    await updateDocument(payload.id, payload)
    isEditModalOpen.value = false
    targetDocument.value = null
  } catch (err) {
    console.error('Failed to update document:', err)
  }
}

async function handleDelete(id: string) {
  try {
    await deleteDocument(id)
    isDeleteModalOpen.value = false
    targetDocument.value = null
  } catch (err) {
    console.error('Failed to delete document:', err)
  }
}
</script>

<template>
  <section class="w-full min-w-0 bg-[#fafafa] dark:bg-[#121212] min-h-[85vh] py-4 sm:py-6 transition-colors">
    <div class="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-4">
      
      <!-- Stats & Latest PDF Preview Division -->
      <OrdinanceStats
        :stats="stats"
        :latest-document="latestDocument"
        @view="handleOpenView"
        @download="handleDownload"
      />

      <!-- Interactive Filter Bar -->
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
        :isAdmin="true"
        @resetFilters="resetFilters"
        @openAddModal="handleOpenAdd"
      />

      <!-- Minimalist Legal Documents Table with Pagination & 3-Dots Action Menu -->
      <OrdinanceTable
        :documents="paginatedDocuments"
        :totalCount="filteredDocuments.length"
        :currentPage="currentPage"
        :itemsPerPage="itemsPerPage"
        :isAdmin="true"
        :pending="pending"
        @update:currentPage="currentPage = $event"
        @view="handleOpenView"
        @edit="handleOpenEdit"
        @delete="handleOpenDelete"
        @download="handleDownload"
        @resetFilters="resetFilters"
        @openAddModal="handleOpenAdd"
      />

    </div>

    <!-- Modals -->
    <OrdinanceAddModal
      :open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @submit="handleCreate"
    />

    <OrdinanceEditModal
      :open="isEditModalOpen"
      :document="targetDocument"
      @close="isEditModalOpen = false"
      @submit="handleUpdate"
    />

    <OrdinanceDeleteModal
      :open="isDeleteModalOpen"
      :document="targetDocument"
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />

    <OrdinanceDetailModal
      :open="isDetailModalOpen"
      :document="targetDocument"
      @close="isDetailModalOpen = false"
    />
  </section>
</template>
