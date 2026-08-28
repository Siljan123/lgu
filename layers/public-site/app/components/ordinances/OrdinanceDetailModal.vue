<script setup lang="ts">
import {
  X,
  FileText,
  Calendar,
  Download,
  ExternalLink,
  Tag,
  Scale,
  ShieldAlert,
  Award,
} from '@lucide/vue'
import type { LegalDocument } from '../../../types/ordinance'

const props = defineProps<{
  document: LegalDocument | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A'
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

</script>

<template>
  <div
    v-if="open && document"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-sm w-full max-w-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between bg-neutral-50/80 dark:bg-[#222222]/80 shrink-0">
        <div class="flex items-center space-x-3">
         
        </div>

        <button
          type="button"
          @click="emit('close')"
          aria-label="Close modal"
          class="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          <X class="size-5" />
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
        <!-- Title & Date -->
        <div class="space-y-2">
          <h2 class="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug">
            {{ document.title }}
          </h2>
          <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            <div class="flex items-center space-x-1.5">
              <Calendar class="size-3.5 text-[#dc2626]" />
              <span>Date Promulgated / Issued: <strong>{{ formatDate(document.date_issued) }}</strong></span>
            </div>
            <div class="flex items-center space-x-1.5">
              <FileText class="size-3.5 text-neutral-400" />
              <span>Category: <strong>{{ document.type }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Description / Statement of Purpose -->
        <div v-if="document.description" class="space-y-1.5">
          <h4 class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            Statement of Purpose & Overview
          </h4>
          <div class="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {{ document.description }}
          </div>
        </div>

        <!-- Tags / Topics -->
        <div v-if="document.tags && document.tags.length > 0" class="space-y-1.5">
          <h4 class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            Subject Tags & Policy Areas
          </h4>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in document.tags"
              :key="tag"
              class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
            >
              <Tag class="size-3 text-[#dc2626]" />
              <span>{{ tag }}</span>
            </span>
          </div>
        </div>

        <!-- Document Preview / PDF Frame -->
        <div class="space-y-2 pt-2">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              Official PDF Copy
            </h4>
            <a
              v-if="document.pdf_url && document.pdf_url !== '#'"
              :href="document.pdf_url"
              target="_blank"
              class="inline-flex items-center space-x-1 text-xs text-[#dc2626] hover:underline font-medium"
            >
              <span>Open in New Tab</span>
              <ExternalLink class="size-3" />
            </a>
          </div>

          <div
            v-if="document.pdf_url && document.pdf_url.endsWith('.pdf')"
            class="w-full h-80 sm:h-96 rounded-md border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-900"
          >
            <iframe
              :src="document.pdf_url"
              class="w-full h-full"
              title="PDF Preview"
            />
          </div>

          <div
            v-else
            class="p-6 rounded-md border border-dashed border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col items-center justify-center text-center space-y-3"
          >
            <div class="size-12 rounded-md bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center">
              <FileText class="size-6" />
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                Official PDF Document Available
              </p>
              <p class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Download the verified official copy for archiving or offline viewing.
              </p>
            </div>
            <a
              v-if="document.pdf_url && document.pdf_url !== '#'"
              :href="document.pdf_url"
              target="_blank"
              download
              class="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Download class="size-3.5" />
              <span>Download PDF File</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-5 py-3 sm:px-6 sm:py-3.5 border-t border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between bg-neutral-50/80 dark:bg-[#222222]/80 shrink-0">
        <span class="text-[11px] text-neutral-500 dark:text-neutral-400">
          Municipality of San Francisco, Agusan del Sur
        </span>
        <button
          type="button"
          @click="emit('close')"
          class="px-4 py-1.5 text-xs font-semibold bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md transition cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
