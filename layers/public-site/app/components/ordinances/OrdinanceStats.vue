<script setup lang="ts">
import { computed } from 'vue'
import {
  FileText,
  Scale,
  ShieldAlert,
  Award,
  Calendar,
  Eye,
  Download,
  ExternalLink,
} from '@lucide/vue'
import type { LegalDocument, LegalDocumentStats } from '../../../types/ordinance'

const props = defineProps<{
  stats: LegalDocumentStats
  latestDocument?: LegalDocument | null
}>()

const emit = defineEmits<{
  (e: 'view', doc: LegalDocument): void
  (e: 'download', doc: LegalDocument): void
}>()

const resolvedDocument = computed<LegalDocument | null>(() => {
  if (props.latestDocument) return props.latestDocument
  return {
    id: 'default-latest',
    type: 'ordinance',
    document_number: 'ORD-2024-001',
    title: 'Comprehensive Environmental Protection and Waste Management Code',
    description: 'Enacting the ecological solid waste management guidelines and environmental protection code of San Francisco, Agusan del Sur.',
    pdf_url: '/sample-ordinance.pdf',
    date_issued: '2024-01-15',
    status: 'active',
    tags: ['Environment', 'Sanitation'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  }
})

const actualPdfUrl = computed<string>(() => {
  const url = resolvedDocument.value?.pdf_url
  if (url && url !== '#' && (url.includes('.pdf') || url.startsWith('http') || url.startsWith('blob:') || url.startsWith('/'))) {
    return url
  }
  return '/sample-ordinance.pdf'
})

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A'
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

function getTypeDetails(type?: string) {
  switch (type) {
    case 'ordinance':
      return {
        label: 'Ordinance',
        bg: 'bg-[#dc2626]/10 text-[#dc2626] border-[#dc2626]/20 dark:bg-[#dc2626]/20 dark:text-[#f87171]',
        icon: Scale,
      }
    case 'executive_order':
      return {
        label: 'Executive Order',
        bg: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-950/40 dark:text-blue-300',
        icon: ShieldAlert,
      }
    case 'resolution':
      return {
        label: 'Resolution',
        bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-300',
        icon: Award,
      }
    default:
      return {
        label: 'Document',
        bg: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300',
        icon: FileText,
      }
  }
}

</script>

<template>
  <div class="grid grid-cols-1  lg:grid-cols-12 gap-4 items-stretch">
    <div class="lg:col-span-6 grid grid-cols-1 gap-1  h-full">
      <div class="group relative p-3.5 sm:p-4 transition-all hover:border-[#c7c7c7] dark:hover:border-[#404040] flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class=" font-medium uppercase tracking-wider text-[#b91c1c] text-sm">
            Total Records
          </span>
          <div class="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            <FileText class="size-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2 ml-6 border-b">
          <span class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {{ stats.total }}
          </span>
          <span class="text-[11px] text-[#707070] dark:text-[#a3a3a3]">All records</span>
        </div>
      </div>
      <div class="group relative p-3.5 sm:p-4 transition-all hover:border-[#c7c7c7] dark:hover:border-[#404040] flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class=" font-medium uppercase tracking-wider text-[#b91c1c] text-sm">
            Ordinances
          </span>
          <div class="p-1.5 rounded-lg bg-[#dc2626]/10 dark:bg-[#dc2626]/20 text-[#dc2626] dark:text-[#f87171]">
            <Scale class="size-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2 ml-6 border-b">
          <span class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {{ stats.ordinances }}
          </span>
          <span class="text-[11px] text-[#707070] dark:text-[#a3a3a3]">Enacted</span>
        </div>
      </div>

      <div class="group relative p-3.5 sm:p-4 transition-all hover:border-blue-500/30 dark:hover:border-blue-500/40 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class=" font-medium uppercase tracking-wider text-[#b91c1c] text-sm">
            Exec. Orders
          </span>
          <div class="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <ShieldAlert class="size-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2 ml-6  border-b border-[#dfdfdf] dark:border-[#2e2e2e] ">
          <span class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {{ stats.executiveOrders }}
          </span>
          <span class="text-[11px] text-[#707070] dark:text-[#a3a3a3]">Issued</span>
        </div>
      </div>

      <div class="group relative p-3.5 sm:p-4 transition-all hover:border-amber-500/30 dark:hover:border-amber-500/40 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class=" font-medium uppercase tracking-wider text-[#b91c1c] text-sm">
            Resolutions
          </span>
          <div class="p-1.5 rounded-lg bg-amber-500/10 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Award class="size-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2 ml-6 border-b">
          <span class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {{ stats.resolutions }}
          </span>
          <span class="text-[11px] text-[#707070] dark:text-[#a3a3a3]">Adopted</span>
        </div>
      </div>
    </div>

    <div class="lg:col-span-6 rounded-sm bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2e2e2e] p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between space-y-3">
      <div class="flex items-center justify-between gap-2 border-b border-[#dfdfdf]/70 dark:border-[#2e2e2e]/70 pb-3">
        <div v-if="resolvedDocument" class="flex items-center space-x-2">
          <span
            class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border"
          >
            <span>{{ getTypeDetails(resolvedDocument.type).label }}</span>
          </span>
          <span class="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 tabular-nums">
            <Calendar class="size-3 text-neutral-400" />
            {{ formatDate(resolvedDocument.date_issued) }}
          </span>
        </div>
      </div>

      <div v-if="resolvedDocument" class="space-y-1.5">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs font-bold text-[#dc2626] dark:text-[#f87171]">
            {{ resolvedDocument.document_number }}
          </span>
        </div>
        <h4
          class="text-sm font-semibold text-neutral-900 dark:text-white leading-snug line-clamp-1 hover:text-[#dc2626] dark:hover:text-[#f87171] transition-colors cursor-pointer"
          :title="resolvedDocument.title"
          @click="emit('view', resolvedDocument)"
        >
          {{ resolvedDocument.title }}
        </h4>
        <p v-if="resolvedDocument.description" class="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
          {{ resolvedDocument.description }}
        </p>
      </div>

      <div class="relative w-full h-65 sm:h-70 rounded-lg border border-[#dfdfdf] dark:border-[#2e2e2e] bg-neutral-100 dark:bg-[#141414] overflow-hidden shadow-inner">
        <object
          :data="`${actualPdfUrl}#view=FitH&toolbar=0&navpanes=0`"
          type="application/pdf"
          class="w-full h-full border-0 block"
        >
          <iframe
            :src="`${actualPdfUrl}#view=FitH&toolbar=0&navpanes=0`"
            class="w-full h-full border-0 block"
            title="Actual PDF Document Viewer"
          />
        </object>
      </div>

    </div>

  </div>
</template>
