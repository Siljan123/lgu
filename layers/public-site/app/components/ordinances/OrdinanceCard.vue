<script setup lang="ts">
import {
  FileText,
  Calendar,
  Eye,
  Download,
  Edit3,
  Trash2,
  Tag,
  Scale,
  ShieldAlert,
  Award,
} from '@lucide/vue'
import type { LegalDocument } from '../../../types/ordinance'

const props = withDefaults(
  defineProps<{
    document: LegalDocument
    isAdmin?: boolean
  }>(),
  {
    isAdmin: false,
  }
)

const emit = defineEmits<{
  (e: 'view', doc: LegalDocument): void
  (e: 'edit', doc: LegalDocument): void
  (e: 'delete', doc: LegalDocument): void
}>()

function formatDate(dateString: string): string {
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

function getTypeDetails(type: string) {
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
        label: 'SB Resolution',
        bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-300',
        icon: Award,
      }
    default:
      return {
        label: 'Document',
        bg: 'bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200',
        icon: FileText,
      }
  }
}

</script>

<template>
  <div class=" dark:bg-[#1c1c1c] w-full p-4 transition-all justify-between border-b group">
    <div class="space-y-3.5 w-full">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center space-x-1 text-[11px] text-neutral-500 dark:text-neutral-400 shrink-0">
          <Calendar class="size-3 text-neutral-400" />
          <span>{{ formatDate(document.date_issued) }}</span>
        </div>
      </div>
      <div class="ml-4">
        <div>
          <span class="text-xs font-semibold text-[#dc2626] dark:text-[#f87171] block">
            {{ document.document_number }}
          </span>
          <h4 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 leading-snug line-clamp-2 transition-colors">
            {{ document.title }}
          </h4>
        </div>

        <p v-if="document.description" class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
          {{ document.description }}
        </p>

        <div v-if="document.tags && document.tags.length > 0" class="flex flex-wrap gap-1.5 pt-1">
          <span
            v-for="tag in document.tags.slice(0, 4)"
            :key="tag"
            class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          >
            <Tag class="size-2.5 opacity-60" />
            <span>{{ tag }}</span>
          </span>
          <span
            v-if="document.tags.length > 4"
            class="text-[10px] text-neutral-400 dark:text-neutral-500 self-center"
          >
            +{{ document.tags.length - 4 }} more
          </span>
        </div>

        </div>
          <div class="flex items-center space-x-2 mt-4">
            <button
              type="button"
              @click="emit('view', document)"
              class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-sm transition cursor-pointer"
            >
              <Eye class="size-3.5 text-[#dc2626]" />
              <span>Preview</span>
            </button>

            <a
              v-if="document.pdf_url && document.pdf_url !== '#'"
              :href="document.pdf_url"
              target="_blank"
              download
              class="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              title="Direct Download PDF"
            >
              <Download class="size-3.5" />
            </a>
      </div>
    </div>  
  </div>
</template>
