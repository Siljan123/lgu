<script setup lang="ts">
import { ref } from 'vue'
import { Download, FileText, Calendar, SearchX, Loader2, CheckCircle2, Eye } from '@lucide/vue'
import type { DisclosureDocument } from '../../composables/useFullDisclosure'
import { usePdfDownloader } from '../../composables/usePdfDownloader'
import DisclosurePdfTemplateModal from './DisclosurePdfTemplateModal.vue'

defineProps<{
  documents: DisclosureDocument[]
  activeFiltersCount: number
}>()

const emit = defineEmits<{
  (e: 'resetFilters'): void
}>()

const { downloadingId, downloadSuccessId, downloadPdf } = usePdfDownloader()

const activePreviewDoc = ref<DisclosureDocument | null>(null)
const isModalOpen = ref(false)

const openPreview = (doc: DisclosureDocument) => {
  activePreviewDoc.value = doc
  isModalOpen.value = true
}

const closePreview = () => {
  isModalOpen.value = false
  activePreviewDoc.value = null
}
</script>

<template>
  <div class="space-y-4">
    
    <div class="flex items-center justify-between">
      <h3 class="text-xs uppercase tracking-wider font-semibold text-[#707070] dark:text-[#a3a3a3]">
        Published Disclosure Reports
      </h3>
    </div>

    <div v-if="documents.length > 0" class="space-y-3.5">
      <article
        v-for="doc in documents"
        :key="doc.id"
        class="border-b p-5 sm:p-6 transition-all hover:border-[#c7c7c7] dark:hover:border-[#3a3a3a] space-y-3"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-[#dfdfdf]/60 dark:border-[#2a2a2a] pb-3">
          <div class="space-y-1">
            <span class="text-[11px] uppercase tracking-wider font-semibold text-brand">
              {{ doc.categoryTitle }}
            </span>
            <h4 class="text-base sm:text-lg font-semibold text-primary tracking-tight">
              {{ doc.title }}
            </h4>
          </div>

          <div class="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fafafa] dark:bg-[#252525] border border-[#dfdfdf] dark:border-[#333333] text-primary">
              {{ doc.year }}
            </span>
            <span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
              {{ doc.quarter }}
            </span>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
          Published by the <strong class="text-primary font-medium">{{ doc.publishedBy }}</strong>. Covers the period <strong class="text-primary font-medium">{{ doc.periodCovered }}</strong>.
        </p>

        <div class="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex flex-wrap items-center gap-4 text-[#707070] dark:text-[#a3a3a3] text-[11px]">
            <span class="flex items-center gap-1.5">
              <Calendar class="size-3.5" />
              Published: {{ doc.publishedDate }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openPreview(doc)"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-medium bg-[#fafafa] dark:bg-[#252525] text-primary border border-[#dfdfdf] dark:border-[#333333] hover:border-brand hover:text-brand transition-colors cursor-pointer"
            >
              <Eye class="size-3.5 shrink-0" />
              <span>Preview</span>
            </button>

            <!-- Download PDF Button with Composable Handler -->
            <button
              type="button"
              @click="downloadPdf(doc)"
              :disabled="downloadingId === doc.id"
              :class="[
                'inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium transition-all  cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed',
                downloadSuccessId === doc.id
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-brand text-white hover:bg-brand-deep'
              ]"
              :aria-label="`Download PDF report: ${doc.title}`"
            >
              <Loader2 v-if="downloadingId === doc.id" class="size-3.5 animate-spin shrink-0" />
              <CheckCircle2 v-else-if="downloadSuccessId === doc.id" class="size-3.5 text-emerald-300 shrink-0" />
              <Download v-else class="size-3.5 shrink-0" />

              <span>
                {{ downloadingId === doc.id ? 'Downloading...' : downloadSuccessId === doc.id ? 'Downloaded PDF' : 'Download PDF' }}
              </span>
            </button>
          </div>
        </div>
      </article>
    </div>

    <div
      v-else
      class="py-16 px-4 text-center rounded-md border border-dashed border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] space-y-4"
    >
      <div class="size-12 rounded-full bg-[#fafafa] dark:bg-[#252525] border border-[#dfdfdf] dark:border-[#333333] flex items-center justify-center mx-auto text-[#707070] dark:text-[#a3a3a3]">
        <SearchX class="size-6" />
      </div>

      <div class="space-y-1 max-w-md mx-auto">
        <h4 class="text-sm font-semibold text-primary">
          No compliance documents found
        </h4>
        <p class="text-xs text-[#707070] dark:text-[#a3a3a3]">
          No reports match your active search or filter selection. Try adjusting your year, quarter, or document category parameters.
        </p>
      </div>

      <button
        v-if="activeFiltersCount > 0"
        type="button"
        @click="emit('resetFilters')"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-[#dfdfdf] dark:border-[#333333] hover:border-brand hover:text-brand transition-colors cursor-pointer"
      >
        Clear All Filters
      </button>
    </div>

    <!-- Official PDF Template Preview Modal -->
    <DisclosurePdfTemplateModal
      :document="activePreviewDoc"
      :isOpen="isModalOpen"
      @close="closePreview"
    />

  </div>
</template>
