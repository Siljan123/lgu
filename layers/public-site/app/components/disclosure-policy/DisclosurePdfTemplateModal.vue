<script setup lang="ts">
import { computed } from 'vue'
import { X, Printer, Download, ShieldCheck, Landmark, FileText } from '@lucide/vue'
import type { DisclosureDocument } from '../../composables/useFullDisclosure'
import { usePdfDownloader } from '../../composables/usePdfDownloader'
import { useMunicipalOfficials } from '../../composables/useMunicipalOfficials'

const props = defineProps<{
  document: DisclosureDocument | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { downloadingId, downloadPdf } = usePdfDownloader()
const { mayor, getOfficialByOffice } = useMunicipalOfficials()

// Dynamic Certifier (Prepared & Certified Correct by)
const certifier = computed(() => {
  if (!props.document) return { name: '', title: '', department: '' }

  if (props.document.certifyingOfficer) {
    return {
      name: props.document.certifyingOfficer,
      title: props.document.publishedBy,
      department: props.document.publishedBy
    }
  }

  const official = getOfficialByOffice(props.document.publishedBy)
  return {
    name: official.name,
    title: official.title,
    department: official.department || props.document.publishedBy
  }
})

// Dynamic Approver (Approved for Public Release)
const approver = computed(() => {
  if (props.document && props.document.approvingOfficer) {
    return {
      name: props.document.approvingOfficer.name,
      title: props.document.approvingOfficer.title
    }
  }
  return {
    name: mayor.value?.name,
    title: mayor.value?.title
  }
})

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && document"
      class="fixed inset-0 z-100 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto print:block printable-modal-wrapper"
    >
      <!-- Modal Container -->
      <div class="relative w-full max-w-4xl bg-[#ffffff] dark:bg-[#1c1c1c] print:bg-[#ffffff] border border-[#dfdfdf] dark:border-[#2a2a2a] print:border-none rounded-2xl print:rounded-none shadow-2xl print:shadow-none flex flex-col max-h-[92vh] print:max-h-none overflow-hidden print:overflow-visible printable-document-modal">
        
        <!-- Modal Action Header Bar (Screen Only - Hidden in Print) -->
        <div class="px-6 py-4 border-b border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] flex items-center justify-between gap-4 no-print">
          <div class="flex items-center gap-2">
            <FileText class="size-5 text-brand shrink-0" />
            <h3 class="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary truncate max-w-md">
              Official Document Preview: {{ document.title }}
            </h3>
          </div>

          <div class="flex items-center gap-2.5">
            <button
              type="button"
              @click="handlePrint"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#ffffff] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] hover:border-brand text-primary transition-colors cursor-pointer"
            >
              <Printer class="size-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              @click="downloadPdf(document)"
              :disabled="downloadingId === document.id"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-brand text-white hover:bg-brand-deep transition-colors cursor-pointer disabled:opacity-75"
            >
              <Download class="size-3.5" />
              <span>{{ downloadingId === document.id ? 'Downloading...' : 'Download PDF' }}</span>
            </button>

            <button
              type="button"
              @click="emit('close')"
              class="p-1.5 rounded-lg text-[#707070] hover:text-primary hover:bg-[#fafafa] dark:hover:bg-[#252525] transition-colors cursor-pointer"
              aria-label="Close document modal"
            >
              <X class="size-5" />
            </button>
          </div>
        </div>

        <!-- Printable Document Body Content -->
        <div class="p-6 sm:p-10 overflow-y-auto space-y-8 bg-[#ffffff] text-[#171717] print:p-0 print:overflow-visible printable-content">
          
          <div class="text-center space-y-1.5 border-b pb-6 border-[#dfdfdf]">
          
            <p class="text-[11px] uppercase tracking-widest font-semibold text-[#707070]">
              Republic of the Philippines • Province of Agusan del Sur
            </p>
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight uppercase text-[#171717]">
              Municipality of San Francisco
            </h1>
            <p class="text-xs uppercase font-medium tracking-wider text-brand">
              Department of the Interior and Local Government (DILG) Full Disclosure Portal
            </p>
          </div>

          <!-- Document Title & Header Info -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xs text-[#707070] font-mono">
                Document ID: {{ document.id.toUpperCase() }}
              </span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              {{ document.title }}
            </h2>

            <p class="text-sm text-[#707070] italic">
              "{{ document.categoryDescription }}"
            </p>
          </div>

          <!-- General Metadata Grid Table -->
          <div class="border rounded-sm overflow-hidden border-[#dfdfdf]">
            <div class="bg-[#fafafa] px-4 py-2.5 border-b border-[#dfdfdf] font-semibold text-xs uppercase tracking-wider text-[#171717]">
              Official Report Specification
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#dfdfdf] text-xs">
              <div class="p-4 space-y-2">
                <div>
                  <span class="text-[#707070] text-[10px] uppercase font-semibold">Publishing Office</span>
                  <p class="font-medium text-[#171717]">{{ document.publishedBy }}</p>
                </div>
                <div>
                  <span class="text-[#707070] text-[10px] uppercase font-semibold">Coverage Period</span>
                  <p class="font-medium text-[#171717]">{{ document.periodCovered }}</p>
                </div>
              </div>

              <div class="p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-[#707070] text-[10px] uppercase font-semibold">Fiscal Period</span>
                    <p class="font-medium text-[#171717]">{{ document.year }} — {{ document.quarter }}</p>
                  </div>
                  <div>
                    <span class="text-[#707070] text-[10px] uppercase font-semibold">Publication Date</span>
                    <p class="font-medium text-[#171717]">{{ document.publishedDate }}</p>
                  </div>
                </div>
                <div>
                  <span class="text-[#707070] text-[10px] uppercase font-semibold">Certifying Authority</span>
                  <p class="font-medium text-[#171717]">{{ certifier.name }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <h3 class="text-xs uppercase tracking-wider font-bold text-[#171717] flex items-center gap-2">
              <ShieldCheck class="size-4 text-brand" />
              Executive Highlights & Accomplishments
            </h3>
            <ul class="space-y-2 text-xs text-[#171717] border-l-2 border-brand pl-4">
              <li
                v-for="(highlight, idx) in document.summaryHighlights"
                :key="idx"
                class="leading-relaxed"
              >
                {{ highlight }}
              </li>
            </ul>
          </div>

          <div v-if="document.financialBreakdown && document.financialBreakdown.length > 0" class="space-y-3">
            <h3 class="text-xs uppercase tracking-wider font-bold text-[#171717] flex items-center gap-2">
              Financial Allocation & Fund Utilization Statement
            </h3>

            <div class="border rounded-sm overflow-hidden border-[#dfdfdf]">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#fafafa] border-b border-[#dfdfdf] uppercase text-[10px] font-semibold text-[#707070]">
                  <tr>
                    <th class="p-3">Program / Item Particulars</th>
                    <th class="p-3 text-right">Amount (PHP)</th>
                    <th class="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#dfdfdf]">
                  <tr v-for="(item, idx) in document.financialBreakdown" :key="idx" class="hover:bg-[#fafafa]">
                    <td class="p-3 font-medium text-[#171717]">{{ item.label }}</td>
                    <td class="p-3 text-right font-mono font-semibold text-[#171717]">{{ item.amount }}</td>
                    <td class="p-3 text-center">
                      <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-[#fafafa] border border-[#dfdfdf] text-[#171717]">
                        {{ item.status || 'Verified' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="pt-6 border-t border-[#dfdfdf] space-y-6">

            <div class="grid grid-cols-2 gap-8 pt-4 text-xs">
              <div class="space-y-8">
                <p class="text-[#707070]">Prepared & Certified Correct by:</p>
                <div class="border-t border-[#171717] pt-1 inline-block min-w-[200px]">
                  <p class="font-bold text-[#171717]">{{ certifier.name }}</p>
                  <p class="text-[11px] text-[#707070]">{{ certifier.title }}</p>
                </div>
              </div>

              <div class="space-y-8 text-right">
                <p class="text-[#707070]">Approved for Public Release:</p>
                <div class="border-t border-[#171717] pt-1 inline-block min-w-[200px] text-right">
                  <p class="font-bold text-[#171717]">{{ approver.name }}</p>
                  <p class="text-[11px] text-[#707070]">{{ approver.title }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </Teleport>
</template>

<style>
@media print {
  /* Hide entire web page content in print mode */
  body * {
    visibility: hidden !important;
  }

  /* Make ONLY the printable document modal and its children visible */
  .printable-modal-wrapper,
  .printable-modal-wrapper *,
  .printable-document-modal,
  .printable-document-modal * {
    visibility: visible !important;
  }

  /* Position document modal at top left of printed page */
  .printable-modal-wrapper {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: auto !important;
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .printable-document-modal {
    position: relative !important;
    width: 100% !important;
    max-width: 100% !important;
    border: none !important;
    box-shadow: none !important;
    background: #ffffff !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  /* Completely remove modal action bar & buttons from print output */
  .no-print {
    display: none !important;
    height: 0 !important;
    overflow: hidden !important;
  }

  .printable-content {
    padding: 0 !important;
    overflow: visible !important;
    background: #ffffff !important;
    color: #171717 !important;
  }

  /* Page setup: Clean A4 margin without extra blank pages */
  @page {
    size: portrait;
    margin: 12mm;
  }
}
</style>
